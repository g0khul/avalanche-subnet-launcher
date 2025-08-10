import React from "react";

interface ValidatorNode {
  node_id: string;
  stake_amount: string;
  stake_start_time: string;
  stake_end_time: string;
  reward_address: string;
}

interface DashboardData {
  total_nodes: number;
  active_nodes: number;
  inactive_nodes: number;
  node_data: ValidatorNode[];
}

const DashboardPage: React.FC = () => {
  const rawData = window.localStorage.getItem("dashboardData");
  if (!rawData)
    return <p>No dashboard data found. Please create a subnet first.</p>;

  const data: DashboardData = JSON.parse(rawData);

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Subnet Dashboard</h1>

      <div className="status-bar">
        <StatusDot color="green" label={`Active Nodes: ${data.active_nodes}`} />
        <StatusDot
          color="red"
          label={`Inactive Nodes: ${data.inactive_nodes}`}
        />
        <StatusDot color="gray" label={`Total Nodes: ${data.total_nodes}`} />
      </div>

      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Node ID</th>
            <th>Stake Amount</th>
            <th>Stake Start Time</th>
            <th>Stake End Time</th>
            <th>Reward Address</th>
          </tr>
        </thead>
        <tbody>
          {(data.node_data ?? []).map((node, i) => (
            <tr key={i}>
              <td>{node.node_id}</td>
              <td>{node.stake_amount}</td>
              <td>
                {new Date(
                  Number(node.stake_start_time) * 1000
                ).toLocaleString()}
              </td>
              <td>
                {new Date(Number(node.stake_end_time) * 1000).toLocaleString()}
              </td>
              <td>{node.reward_address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

interface StatusDotProps {
  color: string;
  label: string;
}

const StatusDot: React.FC<StatusDotProps> = ({ color, label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
    <div
      style={{
        width: 14,
        height: 14,
        borderRadius: "50%",
        backgroundColor: color,
      }}
    />
    <span>{label}</span>
  </div>
);

export default DashboardPage;
