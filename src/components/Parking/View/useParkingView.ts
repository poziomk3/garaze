import { useEffect, useRef } from "react";
import { useParkingViewContext } from "./ParkingViewContext";
import * as fabric from "fabric";
import { createGridPattern } from "../Commons/utils/createGridPattern";
import { FabricMeta, FabricObjectTypes } from "../Commons/utils/constants";
import { useCanvas } from "../Commons/context/CanvasContext";
import { useSelectedSpot } from "../../../app/context/SelectedSpotProvider"; 

function setSpotSelectable(spot: fabric.Rect) {
  spot.selectable = false;
  spot.evented = true;
  spot.hasControls = false;
  spot.hoverCursor = "pointer";
}

function setNonInteractive(obj: fabric.Object) {
  obj.selectable = false;
  obj.evented = false;
  obj.hoverCursor = "default";
}

export function useParkingViewRender() {
  const { canvas } = useCanvas();
  const { parking } = useParkingViewContext();
  const didRender = useRef(false);
  const selectedSpotRef = useSelectedSpot();  // <---

  useEffect(() => {
    if (!canvas || didRender.current) return;
    didRender.current = true;

    canvas.clear();

    // Restore grid background after clear!
    canvas.backgroundColor = createGridPattern();
    if (!parking) return;

    // Render zones
    parking.zones.forEach((zone) => {
      setNonInteractive(zone.fabricObject);
      canvas.add(zone.fabricObject);
    });

    // Render obstacles
    parking.obstacles.forEach((obs) => {
      setNonInteractive(obs.fabricObject);
      canvas.add(obs.fabricObject);
    });

    // Spots (selectable)
    parking.spotGroups.forEach((group) => {
      group.spots.forEach((spot) => {
        setSpotSelectable(spot);
        spot.set("fill", "#bbb"); // reset to default on render
        canvas.add(spot);
      });
    });

    canvas.requestRenderAll();
    canvas.selectionBorderColor = "#e33327";
    canvas.requestRenderAll();
  }, [canvas, parking]);

  useEffect(() => {
    if (!canvas) return;

    const onRectClick = (e: any) => {
      const obj = e.target;
      if (
        obj instanceof fabric.Rect &&
        obj.get(FabricMeta.OBJECT_TYPE) === FabricObjectTypes.PARKING_GROUP
      ) {
        // Remove highlight from previous
        if (selectedSpotRef.current && selectedSpotRef.current !== obj) {
          selectedSpotRef.current.set("fill", "#bbb");
        }
        // Highlight new
        obj.set("fill", "#e33327");
        selectedSpotRef.current = obj as fabric.Rect;
        canvas.requestRenderAll();
      }
    };

    canvas.on("mouse:down", onRectClick);
    return () => {
      canvas.off("mouse:down", onRectClick);
    };
  }, [canvas]);
}
