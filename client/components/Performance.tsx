import React, { useEffect, useState, ReactElement, FC } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Container,
  Grid,
} from '@mui/material';
import { MemoryData, CPUData, BenchmarkData } from '../../types/types';
import { cpuUsage } from 'process';

const Performance: FC = (): ReactElement => {
  const [memoryData, setMemoryData] = useState<MemoryData>({
    usedMemory: 0,
    peakUsedMemory: 0,
  });
  const [CPUData, setCPUData] = useState<CPUData>({ usedCPU: 0 });
  const [BenchmarkData, setBenchmarkData] = useState<BenchmarkData>({
    BenchmarkResult: null,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMemoryData = async () => {
      try {
        const response = await fetch('/api/memory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        console.log(`response`, response);
        if (!response.ok) {
          throw new Error(`memory front end error ${response.status}`);
        }
        const data: MemoryData = await response.json();
        setMemoryData(data);
      } catch (err) {
        console.error(`Error fetching memory data:`, err);
      }
    };

    const fetchCPUData = async () => {
      try {
        const response = await fetch('/api/cpu', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          throw new Error(`cpu front end error ${response.status}`);
        }
        const data: CPUData = await response.json();
        console.log(`data`, data);
        setCPUData(data);
      } catch (err) {
        console.error(`Error fetching cpu data`, err);
      }
    };
    fetchMemoryData();
    fetchCPUData();
  }, []);

  const runBenchmark = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/benchmark', {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`Error running benchmark ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        setBenchmarkData({ BenchmarkResult: result.output });
      } else {
        setError(`Benchmark failed: ${result.error}`);
      }
    } catch (err: any) {
      setError(`Error running benchmark: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  console.log('Memory State:', JSON.stringify(memoryData));
  console.log('CPU State:', JSON.stringify(CPUData));
  console.log('Benchmark:', BenchmarkData);

  return (
    <div className="bg-black text-white p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4 section-header">Redis Memory and CPU Usage</h1>
      </div>
      <div className="content">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-main-hover p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-2">Memory Usage</h2>
            <p>Used Memory: {memoryData.usedMemory}</p>
            <p>Peak Used Memory: {memoryData.peakUsedMemory}</p>
          </div>
          <div className="bg-main-hover p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-2">CPU Usage</h2>
            <p>Used CPU: {CPUData.usedCPU}</p>
          </div>
        </div>
      </div>
      <button
        onClick={runBenchmark}
        disabled={loading}
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Run Benchmark Test
      </button>
      {BenchmarkData.BenchmarkResult && (
        <div>
          <p>Benchmark results for 5 clients and 10 requests:</p>
          <pre>{BenchmarkData.BenchmarkResult}</pre>
        </div>
      )}
      {!loading && !BenchmarkData && (
        <p>No data yet. Click the button to run the benchmark.</p>
      )}
    </div>
  );
};

export default Performance;
