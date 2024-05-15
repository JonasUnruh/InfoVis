var margin = ({top: 20, right: 20, bottom: 20, left: 20});
var width = 600;
var height = 400;

var svgPCA = d3.select("#svg_chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transfrom", `translate(${margin.left}, ${margin.top})`);

var xScale = d3.scaleLinear()
    .domain([d3.min(data[0], d => d.X1), d3.max(data[0], d => d.X1)]).nice()
    .range([ margin.left , width - margin.right]);

var yScale = d3.scaleLinear()
    .domain([d3.min(data[0], d => d.X2), d3.max(data[0], d => d.X2)]).nice()
    .range([ height - margin.bottom, margin.top ]);

svgPCA.append("g")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(d3.axisBottom(xScale));

svgPCA.append("g")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(d3.axisLeft(yScale));


var color = d3.scaleSequential()
    .domain([0, d3.max(data[0], d => d["Team ID"])])
    .interpolator(d3.interpolateViridis);

svgPCA.append('g')
    .selectAll("dot")
    .data(data[0])
    .enter()
    .append("circle")
        .attr("cx", d => xScale(d.X1) )
        .attr("cy", d => yScale(d.X2) )
        .attr("r", 5)
        .attr("opacity", 0.8)
        .style("fill", d => color(d["Team ID"]))
    .on("mouseover", (event, d) => {
        var customEvent = new CustomEvent("scatterplotHovered", { detail: d["Team Name"] });
        document.dispatchEvent(customEvent);
    })
    .on("mouseout", (event, d) => {
        var customEvent = new CustomEvent("noHover");
        document.dispatchEvent(customEvent);
    })
    .on("click", (event, d) => {
        var customEvent = new CustomEvent("teamClicked", { detail: d["Team Name"] });
        document.dispatchEvent(customEvent);

        highlightClicked
            .attr("cx", xScale(d.X1))
            .attr("cy", yScale(d.X2))
            .attr("opacity", 1);
    });

var highlight = svgPCA.append('circle')
                    .attr("id", "highlightScatter")
                    .attr("cx", xScale(0) )
                    .attr("cy", yScale(0) )
                    .attr("r", 5)
                    .attr("fill", "none")
                    .attr("opacity", 0)
                    .attr("stroke", 'red')
                    .attr("stroke-width", 2);

var highlightClicked = svgPCA.append('circle')
                    .attr("id", "highlightScatter")
                    .attr("cx", xScale(0) )
                    .attr("cy", yScale(0) )
                    .attr("r", 5)
                    .attr("fill", "none")
                    .attr("opacity", 0)
                    .attr("stroke", 'red')
                    .attr("stroke-width", 2);

document.addEventListener("heatmapHovered", (event) => {
    var hoveredData = event.detail;
    
    highlight
        .attr("cx", xScale(hoveredData[0]))
        .attr("cy", yScale(hoveredData[1]))
        .attr("opacity", 1);
});

document.addEventListener("noScatterHover", (event) => {
    highlight
        .attr("opacity", 0);
});