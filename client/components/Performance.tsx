import React, { useEffect, useState, ReactElement, FC } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Container,
  Grid,
} from "@mui/material";
import { MemoryData, CPUData } from "../../types/types";

const Performance: FC = (): ReactElement => {
  const [memoryData, setMemoryData] = useState<MemoryData>({
    usedMemory: 0,
    peakUsedMemory: 0,
  });
  const [cpuData, setCpuData] = useState<CPUData>({ usedCPU: 0 });

  useEffect(() => {
    const fetchMemoryData = async () => {
      try {
        const response = await axios.post<MemoryData>("/memory");
        setMemoryData(response.data);
      } catch (err) {
        console.error(`Error fetching memory data:`, err);
      }
    };

    const fetchCpuData = async () => {
      try {
        const response = await axios.post<CPUData>("/cpu");
        setCpuData(response.data);
      } catch (err) {
        console.error(`Error fetching cpu data`, err);
      }
    };
    fetchMemoryData();
    fetchCpuData();
  }, []);
  const memoryChartData = {
    labels: ["Used Memory", "Peak Used Memory"],
    datasets: [
      {
        label: "Memory Usage",
        data: [memoryData.usedMemory, memoryData.peakUsedMemory],
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
      },
    ],
  };

  const cpuChartData = {
    labels: ["Used CPU"],
    datasets: [
      {
        label: "CPU Usage",
        data: [cpuData.usedCPU],
        backgroundColor: "rgba(153,102,255,0.4)",
        borderColor: "rgba(153,102,255,1)",
        borderWidth: 1,
      },
    ],
  };
  return (
    <Container>
      <Box mt={5}>
        <Typography variant="h4" component="h1" gutterBottom>
          Redis Memory and CPU Usage
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  Memory Usage
                </Typography>
                <Line data={memoryChartData} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  CPU Usage
                </Typography>
                <Line data={cpuChartData} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Performance;
