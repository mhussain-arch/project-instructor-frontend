"use client";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardAction,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

interface ScenarioListItem {
    id: number;
    scenario_title: string;
    scenario_description: string;
    scenario_difficulty: "easy" | "medium" | "hard";
    scenario_endpoint: string;
}

export default function Page() {
  // scenario is the state variable
  // setScenario is the state changing function / updater function
  const [scenarios, setScenario] = useState<ScenarioListItem[]>([]); // This will hold the scenarios
  const [isLoading, setLoading] = useState<boolean>(true);
  
  // This function is used to set-up a scenario
  const startScenario = async (scenario_endpoint: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/scenarios/${scenario_endpoint}`)
  }
  // Fetch available scenarios that have been developed so far
  useEffect(() => {
    const fetchScenarioListData = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/scenarios`);
      const data = await res.json();
      setScenario(data);
    };

    // This is the general fetching from API way in next.js
    fetchScenarioListData();
    setLoading(false);
  }, []);

  if (isLoading) {
    return (
        <div className="flex justify-center border border-red-600">
            <Button disabled variant={ "outline" }>
                <Spinner>
                </Spinner>
                    Loading Scenario List...
            </Button>
        </div>
    )
  }
  return (
    <>
      <div className="grid grid-cols-4 gap-4 border border-green-600 p-5">
        {/* All the cards should be displayed here of the scenarios */}
        {scenarios.map((scenario) => (
            <Card key={ scenario.id } className="w-full">
                <CardHeader>
                <CardTitle>{ scenario.scenario_title }</CardTitle>
                <CardDescription>{ scenario.scenario_description }</CardDescription>
                <CardAction>{
                    scenario.scenario_difficulty[0].toUpperCase() + scenario.scenario_difficulty.slice(1)
                    }</CardAction>
                </CardHeader>
                <CardFooter>
                
                <Button onSubmit={() => ("")} type="submit">Start Scenario</Button>
                </CardFooter>
            </Card>
        ))}
      </div>
    </>
  );
}
