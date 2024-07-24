import { Graph } from './Graph';
import { Node } from './Node';
import { Edge } from './Edge';


export class GraphGenerator {

    public static random<T1, T2>(n_vertex: number, p_connected: number, selfconn: boolean = false) {
        let graph: Graph<T1, T2> = new Graph()
        for (let i = 0; i < n_vertex; i++) {
            let node: Node<T1> = new Node(i.toString(), i.toString(), "")
            graph.addNode(node)
        }
        let edges_ids: number[] = [0]
        graph.nodes.forEach(node1 => {
            graph.nodes.forEach(node2 => {
                if (node1.id !== node2.id) {
                    let prob = Math.random()
                    if (p_connected > prob) {
                        let index = 1
                        if (edges_ids && edges_ids.at(-1)) {
                            index = edges_ids[edges_ids.length - 1] + 1
                        }
                        edges_ids.push(index)
                        let edge: Edge<T1, T2> = new Edge(index.toString(), node1, node2, "", "0")
                        graph.addEdge(edge)
                    }
                }
            });
        });
        return graph
    }

    // 1. connected
    // 2. edges <= 3 * vertices - 6
    // 3. min{d(v)} <= 5
    public static randomPlanar<T1, T2>(n_vertex: number): Graph<T1, T2> {
        let graph: Graph<T1, T2> = new Graph();
        if (n_vertex < 3) {
            return graph;
        }

        // Создаем полный граф на n_vertex вершинах
        let degrees: number[] = [];
        for (let i = 0; i < n_vertex; i++) {
            let node: Node<T1> = new Node(i.toString(), i.toString(), "");
            graph.addNode(node);
            degrees.push(n_vertex - 1);
        }

        let max_n_edges: number = 3 * n_vertex - 6;
        let edges_ids = 0;
        graph.nodes.forEach(node1 => {
            for (let i = Number(node1.id) + 1; i < n_vertex; i++) {
                let node2: Node<T1> = graph.getNode(i.toString()) as Node<T1>;
                let edge: Edge<T1, T2> = new Edge(edges_ids.toString(), node1, node2, "", "0");
                edges_ids++;
                graph.addEdge(edge);
            }
        });

        let edges_count = n_vertex * (n_vertex - 1) / 2;
        let max_degree = n_vertex - 1;

        while (edges_count > max_n_edges || max_degree > 5) {
            let random_node: Node<T1>;
            do {
                random_node = graph.getNode(Math.floor(Math.random() * n_vertex).toString()) as Node<T1>;
            } while (degrees[Number(random_node.id)] <= 2);

            let adj_nodes: Node<T1>[] = graph.getAdjNodes(random_node);
            let adj_nodes_min_deg_3: Node<T1>[] = adj_nodes.filter(node1 => degrees[Number(node1.id)] >= 3);

            if (adj_nodes_min_deg_3.length === 0) {
                let index = Math.floor(Math.random() * adj_nodes.length);
                let adj_node: Node<T1> = adj_nodes[index];
                let del_edge: Edge<T1, T2>;
                if (Number(adj_node.id) < Number(random_node.id)) {
                    del_edge = graph.getEdge(adj_node, random_node) as Edge<T1, T2>;
                } else {
                    del_edge = graph.getEdge(random_node, adj_node) as Edge<T1, T2>;
                }

                let node_less_4_id = degrees.findIndex((num, index) => num <= 4 && index !== Number(adj_node.id) && index !== Number(random_node.id));
                if (node_less_4_id !== -1) {
                    let new_adj_node: Node<T1> = graph.getNode(node_less_4_id.toString()) as Node<T1>;
                    let new_edge: Edge<T1, T2> = new Edge<T1, T2>(edges_ids.toString(), adj_node, new_adj_node, "", "0");
                    edges_ids++;
                    graph.addEdge(new_edge);
                    degrees[Number(new_adj_node.id)]++;
                    graph.popEdge(del_edge);
                    edges_count--;
                    degrees[Number(random_node.id)]--;
                }
            } else {
                let index = Math.floor(Math.random() * adj_nodes_min_deg_3.length);
                let adj_node: Node<T1> = adj_nodes_min_deg_3[index];
                let del_edge: Edge<T1, T2>;
                if (Number(adj_node.id) < Number(random_node.id)) {
                    del_edge = graph.getEdge(adj_node, random_node) as Edge<T1, T2>;
                } else {
                    del_edge = graph.getEdge(random_node, adj_node) as Edge<T1, T2>;
                }
                graph.popEdge(del_edge);
                edges_count--;
                degrees[Number(adj_node.id)]--;
                degrees[Number(random_node.id)]--;
            }

            max_degree = Math.max(...degrees);
        }

        return graph;
    }

}