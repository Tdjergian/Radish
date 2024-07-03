import React, { useState } from "react";
import axios from "axios";

function BenchmarkResult() {
  const [benchmark, setBenchmark] = useState(null);

  const runBenchmark = async () => {
    const response = await axios.get("http://localhost:3001/benchmark");
    setBenchmark(response.data);
  };

  return (
    <div>
      <h1>Redis Benchmark Tool</h1>
      <button onClick={runBenchmark}>Run Benchmark</button>
      {benchmark && <div> {benchmark.duration}</div>}
    </div>
  );
}

export default BenchmarkResult;
