"use client";

import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

interface EChartBoxProps {
  option: any;
  height?: string;
  className?: string;
}

export default function EChartBox({ option, height = "340px", className = "" }: EChartBoxProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    if (!instanceRef.current) {
      instanceRef.current = echarts.init(chartRef.current);
    }

    instanceRef.current.setOption(option, true);

    const handleResize = () => {
      instanceRef.current?.resize();
    };

    window.addEventListener("resize", handleResize);
    const resizeObserver = new ResizeObserver(() => {
      instanceRef.current?.resize();
    });
    resizeObserver.observe(chartRef.current);

    return () => {
      window.removeEventListener("resize", handleResize);
      resizeObserver.disconnect();
    };
  }, [option]);

  useEffect(() => {
    return () => {
      instanceRef.current?.dispose();
      instanceRef.current = null;
    };
  }, []);

  return <div ref={chartRef} style={{ height, width: "100%" }} className={className} />;
}
