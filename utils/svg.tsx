import { SVGInterface, SVGShapeInterface } from "@/db/db";

export function convertSVGtoJSX(svg: SVGInterface): React.JSX.Element {
    let shapesJSX = []
    let i = 0
    for (let shape of svg.shapes!) {
        i += 1
        if (shape.kind == "rect") {
            shapesJSX.push(
                <rect
                    key={i}
                    x={`${shape.x}%`}
                    y={`${shape.y}%`}
                    width={`${shape.width}%`}
                    height={`${shape.height}%`}
                    style={ shape.style }
                />
            )
        } else if (shape.kind == "circle") {
            shapesJSX.push(
                <circle
                    key={i}
                    cx={`${shape.cx}%`}
                    cy={`${shape.cy}%`}
                    r={`${shape.r}%`}
                    style={ shape.style }
                />
            )
        } else if (shape.kind == "ellipse") {
            shapesJSX.push(
                <ellipse
                    key={i}
                    cx={`${shape.cx}%`}
                    cy={`${shape.cy}%`}
                    rx={`${shape.rx}%`}
                    ry={`${shape.ry}%`}
                    style={ shape.style }
                />
            )
        }
    }

    let svgJSX = <svg width={svg.width} height={svg.height}>
        {shapesJSX}
    </svg>

    return svgJSX
}