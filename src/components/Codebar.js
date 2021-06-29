function Codebar({ amount, type }) {
  const mapLines = () => {
    let rows = [];
    for (let i = 1; i <= amount; i++) {
      rows.push(
        <p key={i} className={`${type}-cb-num`}>
          {i}
        </p>
      );
    }
    return rows;
  };
  return <div className={`${type}-codebar`}>{mapLines()}</div>;
}

export default Codebar;
