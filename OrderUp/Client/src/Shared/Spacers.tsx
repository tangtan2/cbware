type spacerSize = "small" | "medium" | "large" | "flex";

const sizeMap = {
  small: 4,
  medium: 8,
  large: 20,
  flex: 1,
};

type Props = { size: spacerSize };

export const RowSpacer = (props: Props) => {
  if (props.size === "flex") {
    return (
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}></div>
    );
  }
  const spacerHeight = sizeMap[props.size];
  return <div style={{ height: spacerHeight }}></div>;
};

export const ColumnSpacer = (props: Props) => {
  if (props.size === "flex") {
    return (
      <div style={{ display: "flex", flexDirection: "row", flex: 1 }}></div>
    );
  }
  const spacerHeight = sizeMap[props.size];
  return <div style={{ width: spacerHeight }}></div>;
};
