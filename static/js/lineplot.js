var margin = ({top: 30, right: 30, bottom: 60, left: 30});
var width = 1000;
var height = 600;


var feature = d3.select("#indicator_change")
    .selectAll("option")
    .data(vars)

feature.enter()
    .append("option")
    .attr("value", d => d)
    .text(d => d)

var yScaleLine = d3.scaleLinear()

var changeIndicator = () => {
    console.log(this)
}

var svgLine = d3.select("#svg_line_plot")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transfrom", `translate(${margin.left}, ${margin.top})`);

var xScaleline = d3.scaleTime()
    .domain(d3.extent(data[2], d => d.season))
    .range([ margin.left , width - margin.right]);
    


svgLine.append("g")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(d3.axisBottom(xScale));

svgLine.append("g")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(d3.axisLeft(yScale));

svgLine.append('path')
    .datum(data[2])
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
        .x(d => x(d.season))
        .y(d => y(d.X2)))