import {Component, FC} from 'react';
import TaskTimer from '../TaskTimer/index';
import { Graph } from '../GraphLibrary/Graph';
import { GraphGenerator } from '../GraphLibrary/GraphGenerator';
import { GraphController } from '../GraphLibrary/GraphController';
import { ToolBar } from '../Toolbar/ToolBar';
import 'bootstrap/dist/css/bootstrap.css';
import './style.css';


interface IProps {

}


interface IState<T1, T2> {
    graph: Graph<T1, T2>;
    task_graph: Graph<T1, T2>;
}


export class Template<T1, T2> extends Component<IProps, IState<T1, T2>> {
    
    visualizing_policy = "circle"

    constructor(props: IProps){
        super(props);

        let g: Graph<T1, T2> = this.generateGraph()
        let t_g: Graph<T1, T2> = this.generateTaskGraph()
        this.state = {
            graph: g,
            task_graph: t_g,
        }
    }

    public render(){
        const Task: any = this.task();
        
        return (
            <div className={'App'} id="wrap">
                {(
                    <div>
                        <div className={'MainRow'}>
                            {this.isGraphModule() &&
                                <GraphController 
                                    id={"cy1"}
                                    className='GraphCell'
                                    graph={this.state.graph} 
                                    visualization_policy={this.visualizing_policy}
                                    is_nodeid_visible={this.isNodeNameVisible()} 
                                    is_weights_visible={this.isEdgeWeightVisible()}/>
                            }
                            <div id={"drtfghbjk"} className={'TaskCell'}>
                                <p>Задание</p>
                                <Task/>                               
                            </div>
                            <div id={"drtfghbjk"} className={'TaskCellGraph'}>
                            <GraphController 
                                    id={"cy2"}
                                    className='TaskCellGraph'
                                    graph={this.state.task_graph} 
                                    visualization_policy={this.visualizing_policy}
                                    is_nodeid_visible={this.isNodeNameVisible()} 
                                    is_weights_visible={this.isEdgeWeightVisible()}/>                              
                            </div>
                            <div className={'ToolCell'}>
                                <ToolBar 
                                    next_stage={this.nextStage} 
                                    base_button={true}
                                    base_button_message={this.helpMessage()}
                                    graph_manipulations_button={this.isGraphModified()} 
                                    graph_coloring_buttons={this.isGraphRepainted()}
                                    graph_adj_coloring_buttons={this.isGraphAdjRepainted()} 
                                    graph_naming_buttons={this.isGraphNodeRenamed()}
                                    graph_weight_buttons={this.isGraphReweight()}
                                    change_visualization_policy_buttons={this.isVisualizingPolicyChangeble()}
                                />
                            </div>
                        </div>
                        <div className={'LeftBottom'}>
                            <TaskTimer timeSeconds={100} onTimerExpire={this.nextStage}/>
                        </div>

                    </div>)}
            </div>
        );
    }

    protected nextStage(){
        console.log("next stage")
    }

    protected helpMessage() {
        return "Good luck!"
    }

    protected task(){
        return () => <p>Это пустой компонент задания</p>;
    }

    protected generateGraph(){
        let graph: Graph<T1, T2> = GraphGenerator.random(5, 0.3)
        return graph
    }

    protected generateTaskGraph(){
        let task_graph: Graph<T1, T2> = GraphGenerator.random(5, 0.3);
        return task_graph
    }

    protected isGraphModule(){
        return true
    }

    protected isGraphModified(){
        return true
    }
    protected isGraphRepainted(){
        return true
    }
    protected isGraphAdjRepainted(){
        return true
    }
    protected isGraphNodeRenamed(){
        return true
    }
    protected isGraphReweight(){
        return true
    }
    protected isVisualizingPolicyChangeble(){
        return true
    }

    protected isNodeNameVisible(){
        return true
    }
    protected isEdgeWeightVisible(){
        return true
    }

    componentDidMount() {
        let vp = document.getElementById("visualization-policy") as HTMLSelectElement
        vp?.addEventListener("change", () => {
            this.visualizing_policy = vp.value
            this.forceUpdate()
        });
    }
}


