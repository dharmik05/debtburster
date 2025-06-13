"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { useState } from "react";
import dashboardData from "../dashboardData.json";
import ChatIcon from "../components/ChatIcon";
import TabSlider from "../components/TabSlider";
import Achievements from "../components/Achievements";
import DebtCard from "../components/DebtCard";
import Header from "../components/Header";
import Summary from "../components/Summary";

export default function Home() {
  const [monthlyIncome, setMonthlyIncome] = useState(
    dashboardData.userProfile.monthlyIncome.toFixed(2)
  );
  const [allocatedIncome, setAllocatedIncome] = useState(
    dashboardData.userProfile.allocatedIncomePercentage.toFixed(1)
  );
  return (
    <>
      <Header />
      <div className="main-container">
        <div id="parent">
          <div id="left-div">
            <Summary
              monthlyIncome={monthlyIncome}
              setMonthlyIncome={setMonthlyIncome}
              allocatedIncome={allocatedIncome}
              setAllocatedIncome={setAllocatedIncome}
            />
            <TabSlider />
          </div>

          <div id="right-div">
            <Achievements />
            <DebtCard />
            <DebtCard />
          </div>
        </div>
      </div>
      <ChatIcon />
    </>
  );
}

