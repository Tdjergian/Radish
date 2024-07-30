import React from "react";
import Slider from "../components/Slider";
import Visual from "../components/Visual";
import Sidebar from "../components/Sidebar";
import RedisForm from "../components/CustForm";
import Header from "../components/Header";

function Main() {
  return (
    <div className="w-full">
      <div className="flex w-full">
        <div className="w-1/4 p-4 bg-black">
          <h2 className="text-center text-3xl mb-4 font-bold section-header">
            Redis Cluster Configuration & Visualizer
          </h2>
          <hr className="mb-4" />
          <Slider />
          <hr className="mt-4" />
          <RedisForm />
        </div>
        <div className="sticky w-3/4 bg-slate-800 mt-10">
          <Visual prototype={true} />
        </div>
      </div>
    </div>
  );
}

export default Main;
