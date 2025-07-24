interface ConnectorLineProps {
  direction: "vertical" | "horizontal"
  length?: string
  color?: string
  thickness?: string
}

export function ConnectorLine({
  direction = "vertical",
  length = "2rem",
  color = "black",
  thickness = "2px",
}: ConnectorLineProps) {
  if (direction === "vertical") {
    return (
      <div
        className="mx-auto"
        style={{
          height: length,
          width: thickness,
          backgroundColor: color,
        }}
      />
    )
  }

  return (
    <div
      className="my-auto"
      style={{
        width: length,
        height: thickness,
        backgroundColor: color,
      }}
    />
  )
}

