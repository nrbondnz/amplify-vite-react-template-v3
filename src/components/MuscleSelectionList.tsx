import { useSubscription } from "@context/SubscriptionContext";
import { IMachine, IExercise, AppEvent } from "@shared/types/types";
import React, { useEffect, useRef, useState } from "react";
import { useDataContext } from "@context/DataContext";
import * as d3 from "d3";

interface MuscleSelectionListProps {
  muscleId: number;
}

const MuscleSelectionList: React.FC<MuscleSelectionListProps> = ({
                                                                   muscleId,
                                                                 }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const { eRM, mM, muM, eM } = useDataContext();
  const { addCustomEvent } = useSubscription();

  // State to track the selected machine
  const [selectedMachineId, setSelectedMachineId] = useState<number | null>(
      null
  );
  const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(
      null
  );

  // React handler for exercise selection (connect this in D3 logic)
  const handleExerciseClick = (exerciseId: number | null) => {
    console.log("Selected exercise id:", exerciseId);
    const dataMap: Map<string, number> = new Map();
    dataMap.set("idMachine", selectedMachineId || 0);
    const event: AppEvent = {
      entity: "exercises",
      entityId: exerciseId || 0,
      actionType: "ADD",
      pageType: "BUILDER",
        entityData: dataMap as unknown as any,
    };
    addCustomEvent(event);
    setSelectedExerciseId((prev) => (prev === exerciseId ? null : exerciseId));
  };

  useEffect(() => {
    if (!svgRef.current) {
      return;
    }

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous renders

    // Create tooltip div
    const tooltip = d3
        .select("body")
        .append("div")
        .style("position", "absolute")
        .style("background", "rgba(0, 0, 0, 0.8)")
        .style("color", "white")
        .style("padding", "5px 10px")
        .style("border-radius", "5px")
        .style("font-size", "12px")
        .style("visibility", "hidden");

    // Layout constants
    const width = 800;
    const startY = 50;
    const muscleX = 150;
    const machineSpacing = 200;
    const exerciseSpacing = 250;
    const rectWidth = 120;
    const rectHeight = 40;
    const verticalSpacing = 80;
    const padding = 50;

    // Fetch the selected muscle
    const selectedMuscle = muM.entities.find((muscle) => muscle.id === muscleId);
    if (!selectedMuscle) {
      console.warn(`Muscle with id ${muscleId} not found`);
      return;
    }

    // Fetch machines associated with the selected muscle (remove duplicates)
    const relatedMachines = Array.from(
        new Set(
            eRM.entities
                .filter((rel) => rel.muscleId === muscleId && rel.machineId !== null)
                .map((rel) =>
                    mM.entities.find((machine) => machine?.id === rel.machineId)
                )
                .filter((machine): machine is IMachine => machine !== undefined)
        )
    );

    // Position machines
    const numMachines = relatedMachines.length;
    const totalHeight = (numMachines - 1) * verticalSpacing;
    const muscleY = numMachines > 0 ? startY + totalHeight / 2 : startY;

    const machinePositions = relatedMachines.map((_, index) => ({
      x: muscleX + machineSpacing,
      y: startY + index * verticalSpacing,
    }));

    const exercisesForSelectedMachine =
        selectedMachineId !== null
            ? Array.from(
                new Set(
                    eRM.entities
                        .filter(
                            (rel) =>
                                rel.machineId === selectedMachineId &&
                                rel.exerciseId !== null
                        )
                        .map((rel) =>
                            eM.entities.find((exercise) => exercise?.id === rel.exerciseId)
                        )
                        .filter((exercise): exercise is IExercise => exercise !== undefined)
                )
            )
            : [];

    const exercisePositions = exercisesForSelectedMachine.map((_, index) => {
      const machinePosition = machinePositions.find(
          (_, i) =>
              relatedMachines[i] && relatedMachines[i].id === selectedMachineId
      );

      const baseY = machinePosition ? machinePosition.y : 0;

      return {
        x: muscleX + machineSpacing + exerciseSpacing,
        y: baseY + index * rectHeight * 1.5,
      };
    });

    const maxYPosition = Math.max(
        ...machinePositions.map((pos) => pos.y),
        ...exercisePositions.map((pos) => pos.y),
        0 // Safe fallback
    );

    svg.attr("width", width).attr("height", maxYPosition + rectHeight + padding);

    // Render the muscle node
    svg
        .append("circle")
        .attr("cx", muscleX)
        .attr("cy", muscleY)
        .attr("r", 30)
        .attr("fill", "#007BFF")
        .on("mouseover", () => {
          tooltip
              .style("visibility", "visible")
              .text(`Muscle: ${selectedMuscle.entityName}`);
        })
        .on("mousemove", (event) => {
          tooltip
              .style("top", `${event.pageY + 10}px`)
              .style("left", `${event.pageX + 10}px`);
        })
        .on("mouseout", () => {
          tooltip.style("visibility", "hidden");
        });

    svg
        .append("text")
        .attr("x", muscleX)
        .attr("y", muscleY + 5)
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .text(selectedMuscle.entityName);

    // Render machines and their connections
    relatedMachines.forEach((machine, index) => {
      const { x, y } = machinePositions[index];

      // Draw connection line: Muscle -> Machine
      svg
          .append("line")
          .attr("x1", muscleX + 30)
          .attr("y1", muscleY)
          .attr("x2", x - rectWidth / 2)
          .attr("y2", y)
          .attr("stroke", "#999")
          .attr("stroke-width", 2);

      // Draw machine block
      const machineGroup = svg.append("g").on("click", () => {
        setSelectedMachineId((prev) => (prev === machine.id ? null : machine.id));
      });

      machineGroup
          .append("rect")
          .attr("x", x - rectWidth / 2)
          .attr("y", y - rectHeight / 2)
          .attr("width", rectWidth)
          .attr("height", rectHeight)
          .attr("fill", selectedMachineId === machine.id ? "#FFAA00" : "#28A745") // Highlight if selected
          .attr("rx", 5)
          .on("mouseover", () => {
            tooltip
                .style("visibility", "visible")
                .text(
                    `${machine.entityName} - ${machine.description || "No description"}`
                );
          })
          .on("mousemove", (event) => {
            tooltip
                .style("top", `${event.pageY + 10}px`)
                .style("left", `${event.pageX + 10}px`);
          })
          .on("mouseout", () => tooltip.style("visibility", "hidden"));

      machineGroup
          .append("text")
          .attr("x", x)
          .attr("y", y + 5)
          .attr("text-anchor", "middle")
          .attr("fill", "white")
          .attr("font-size", "12px")
          .style("cursor", "pointer")
          .text(machine.entityName);
    });

    // Render exercises for the selected machine
    exercisePositions.forEach(({ x, y }, index) => {
      const exercise = exercisesForSelectedMachine[index];

      // Draw connecting line: Machine -> Exercise
      const machinePosition = machinePositions.find(
          (_, i) => relatedMachines[i]?.id === selectedMachineId
      );
      if (machinePosition) {
        svg
            .append("line")
            .attr("x1", machinePosition.x + rectWidth / 2)
            .attr("y1", machinePosition.y)
            .attr("x2", x - rectWidth / 2)
            .attr("y2", y)
            .attr("stroke", "#999")
            .attr("stroke-width", 2);
      }

      svg
          .append("rect")
          .attr("x", x - rectWidth / 2)
          .attr("y", y - rectHeight / 2)
          .attr("width", rectWidth)
          .attr("height", rectHeight)
          .attr("fill", selectedExerciseId === exercise?.id ? "#FFD700" : "#FF5733") // Highlight if selected
          .attr("rx", 5)
          .on("click", () => {
            handleExerciseClick(exercise?.id || null); // Handle React state update
          })
          .on("mouseover", () => {
            tooltip
                .style("visibility", "visible")
                .text(
                    `${exercise?.entityName} - ${
                        exercise?.description || "No description"
                    }`
                );
          })
          .on("mousemove", (event) => {
            tooltip
                .style("top", `${event.pageY + 10}px`)
                .style("left", `${event.pageX + 10}px`);
          })
          .on("mouseout", () => tooltip.style("visibility", "hidden"));

      svg
          .append("text")
          .attr("x", x)
          .attr("y", y + 5)
          .attr("text-anchor", "middle")
          .attr("fill", "white")
          .attr("font-size", "12px")
          .text(exercise?.entityName);
    });

    return () => {
      tooltip.remove();
    };
  }, [
    muscleId,
    selectedMachineId,
    selectedExerciseId,
    eRM.entities,
    mM.entities,
    muM.entities,
    eM.entities,
  ]);

  return (
      <div>
        <h3>
          {muM.entities.find((muscle) => muscle.id === muscleId)?.entityName ||
              "No Muscle Selected"}
        </h3>
        <svg
            ref={svgRef}
            width={800}
            style={{ border: "1px solid #ccc" }}
        />
      </div>
  );
};

export default MuscleSelectionList;