const Redis = require("ioredis");
const si = require("systeminformation");

let isBenchmarkRunning = false;

async function benchmark(
  clusterNodes,
  numRequests,
  parallelClients,
  onProgress
) {
  if (isBenchmarkRunning) return;
  isBenchmarkRunning = true;

  const cluster = new Redis.Cluster(clusterNodes);
  const start = process.hrtime();
  const promises = [];
  let completedRequests = 0;
  for (let i = 0; i < numRequests; i++) {
    promises.push(cluster.set(`key${i}`, `value${i}`));
    if (promises.length >= parallelClients) {
      await Promise.all(promises);
      promises.length = 0;
    }
    completedRequests++;
    if (i % 1000 === 0) onProgress(completedRequests);
  }
  if(promises.length >0) await Promise.all(promises);
  const end = process.hrtime(start);
  const seconds = end[0] + end[1]/1e9;
  await cluster.quit();
  isBenchmarkRunning = false;
  return {totalRequests: numRequests, totalTime: seconds, throughput: numRequests/seconds};

}

async function getSystemMetrics(){
    const cpu = await si.currentLoad();
    const memory = await si.mem();
    return {
        cpuUsage: cpu.currentLoad,
        memoryUsage: (memory.used/1024/1024).toFixed(2),
        memoryTotal:(memory.total/1024/1024).toFixed(2),
    }
}

module.exports = {benchmark, getSystemMetrics}