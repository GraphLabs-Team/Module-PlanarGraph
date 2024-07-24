import TaskTimer from '../TaskTimer/index';
import { Graph } from '../GraphLibrary/Graph';
import { GraphGenerator } from '../GraphLibrary/GraphGenerator';
import { GraphController } from '../GraphLibrary/GraphController';
import { ToolBar } from '../Toolbar/ToolBar';
import { Template } from "../Template";
import Matrix from "../MatrixLibrary/matrix";
import "./style.css"

export class PlanarGraphModule<T1, T2> extends Template<T1, T2> {
  protected override task() { // функция для задания текста и матрицы лабораторной работы
    let n_vertex = 7
    let matrix: number[][] = Array(n_vertex).fill([])
    matrix = matrix.map(() => Array(n_vertex).fill(0))
    let task_graph: Graph<T1, T2> = GraphGenerator.randomPlanar<T1, T2>(n_vertex)
    task_graph.edges.forEach((edge) => {
      let source_id = Number(edge.source.id)
      let target_id = Number(edge.target.id)
      matrix[target_id][source_id] = 1
      matrix[source_id][target_id] = 1
    });
    let names: string[] = Array(n_vertex).fill("").map((val, i) => i + 1 + "")
    const properMatrix = matrix.map((row) => row.map((item) => item + ""));
    return () => (
      <div>
        <p>Постройте граф по матрице смежности и плоско уложите граф на плоскости, перетаскивая вершины. Вершины должны называться также как и соответствующие строки в матрице</p>
        <Matrix
          id="matrix"
          data_array={properMatrix}
          is_mutable={false}
          disableCellClick
          col_names={names}
          row_names={names}
        />
      </div>
    );
  }

  public render() { // функция отрисовки всех полей
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
                  is_weights_visible={this.isEdgeWeightVisible()} />
              }
              <div id={"task-cell"} className={'TaskCell'}>
                <p>Задание</p>
                <Task />
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
              <TaskTimer timeSeconds={100} onTimerExpire={this.nextStage} />
            </div>

          </div>)}
      </div>
    );
  }

  protected override nextStage() {
    console.log("next stage")
  }

  protected override generateGraph() {
    let graph = new Graph<T1, T2>(); //Graph<T1, T2> = GraphGenerator.randomPlanar<T1, T2>(6);
    return graph;
  }

  protected override generateTaskGraph() {
    return new Graph<T1, T2>()
  }

  protected override isGraphModified() {
    return true;
  }

  protected override isGraphRepainted() {
    return false;
  }

  protected override isGraphNodeRenamed() {
    return true;
  }

  protected override isGraphReweight() {
    return false;
  }

  protected isVisualizingPolicyChangeble() {
    return false;
  }

  protected override isNodeNameVisible() {
    return true;
  }

  protected override isEdgeWeightVisible() {
    return false;
  }
  protected override helpMessage() {
    return `Чтобы построить граф используйте опции "Добавить вершину" и "Соединить вершины" 
    (нажать на первую вершину, зажать клавишу shift, выбрать вторую вершину и нажать на кнопку "Соединить вершины")\n
    Определение: Граф уложен плоско, если никакие два ребра не имеют точек пересечения, кроме инцидентных вершин.\n
    Представленный граф является планарным, т.е. у него существует плоская укладка. Вам надо. перетаскивая вершины, плоско уложить граф`;
  }
}
