import { useLayoutEffect, useRef } from "react";

/**
 * Renders a list of items and smoothly animates them sliding to their new
 * position whenever the order changes (e.g. a task moving down once it's
 * marked Completed) — the FLIP technique, explained in the comments below.
 *
 *   <MovableList
 *     items={sortedTasks}
 *     getKey={(task) => task.id}
 *     renderItem={(task) => <TaskCard task={task} ... />}
 *   />
 *
 * IMPORTANT: `items` must already be sorted by the caller — this component
 * only animates the transition, it doesn't decide the order.
 */
export default function MovableList({ items, getKey, renderItem, className = "" }) {
  // A Map from item key -> the actual DOM node for that card.
  // Refs (not state) because touching these should never trigger a re-render.
  const nodeRefs = useRef(new Map());
  // A Map from item key -> that card's last known bounding box on screen.
  const rectsRef = useRef(new Map());

  // useLayoutEffect runs synchronously right after the DOM updates, but
  // BEFORE the browser paints — that's the exact window where FLIP must
  // happen: we need the new layout to exist, but the user must never see
  // the "snapped" frame, only the animated one.
  useLayoutEffect(() => {
    const previousRects = rectsRef.current;
    const nextRects = new Map();

    nodeRefs.current.forEach((node, key) => {
      if (!node) return;
      const newRect = node.getBoundingClientRect(); // "Last" position
      nextRects.set(key, newRect);

      const oldRect = previousRects.get(key); // "First" position
      if (oldRect) {
        const deltaX = oldRect.left - newRect.left;
        const deltaY = oldRect.top - newRect.top;

        if (deltaX || deltaY) {
          // "Invert": jump the card back to where it used to be, instantly,
          // with no transition — this is invisible to the eye because it
          // happens before the browser has painted the new frame at all.
          node.style.transition = "none";
          node.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

          // "Play": on the very next frame, remove the offset WITH a
          // transition turned on. The browser animates from "offset" to
          // "0,0" — i.e. from the old spot to the real new spot.
          requestAnimationFrame(() => {
            node.style.transition = "transform 320ms ease";
            node.style.transform = "translate(0, 0)";
          });
        }
      }
    });

    rectsRef.current = nextRects;
  }, [items]); // re-run this whole dance whenever the sorted list changes

  return (
    <div className={className}>
      {items.map((item) => {
        const key = getKey(item);
        return (
          <div
            key={key}
            ref={(node) => {
              if (node) nodeRefs.current.set(key, node);
              else nodeRefs.current.delete(key);
            }}
          >
            {renderItem(item)}
          </div>
        );
      })}
    </div>
  );
}
