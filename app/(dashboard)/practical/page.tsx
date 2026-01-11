"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ScenarioCard, ScenarioListItem } from "./scenario-card";

export default function Page() {
  const [scenarios, setScenarios] = useState<ScenarioListItem[]>([]);
  const [isPageLoading, setPageLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchScenarioListData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/scenarios`);
        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();
        setScenarios(data);
      } catch (error) {
        console.error("Error fetching scenarios:", error);
      } finally {
        // We set loading to false AFTER the await is finished
        setPageLoading(false);
      }
    };

    fetchScenarioListData();
  }, []);

  if (isPageLoading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <Button disabled variant={"outline"}>
          <Spinner className="mr-2" />
          Loading Scenario List...
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-5">
      {scenarios.map((scenario) => (
        // We pass the data down, the Card handles its own state
        <ScenarioCard key={scenario.id} scenario={scenario} />
      ))}
    </div>
  );
}
