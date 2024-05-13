var margin = ({top: 30, right: 30, bottom: 60, left: 150});
var width = 750;
var height = 600;

var svg = d3.select("#svg_table")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transfrom", `translate(${margin.left}, ${margin.top})`);


var groups = d3.map(data[1], d => d["Team Name"]);
var vars = d3.map(data[1], d => d.vars);
vars = [...new Set(vars)]

var x = d3.scaleBand()
    .range([ margin.left, width - margin.right ])
    .domain(groups)
    .padding(0.05);
var gx = svg.append("g")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(d3.axisBottom(x).tickSize(0));

gx.select(".domain").remove();

var heatmapTeams = gx.selectAll(".tick text")
                    .style("text-anchor", "end")
                    .style("font-size", 15)
                    .attr("dx", "-.8em")
                    .attr("dy", ".15em")
                    .attr("transform", "rotate(-65)");

var y = d3.scaleBand()
    .range([ height - margin.bottom, margin.top ])
    .domain(vars.map(v => v))
    .padding(0.05);
gy = svg.append("g")
    .attr("id", "yTicks")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(d3.axisLeft(y).tickSize(0));

gy.select(".domain").remove();

var heatmapVars = svg.select("#yTicks").selectAll(".tick text")
    .style("font-size", 15);

var color = d3.scaleSequential()
    .interpolator(d3.interpolateInferno)
    .domain([d3.min(data[1], d => d.values), d3.max(data[1], d => d.values)]);

svg.selectAll()
    .data(data[1])
    .enter()
    .append("rect")
        .attr("x", d => x(d["Team Name"]))
        .attr("y", d => y(d.vars))
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("opacity", 0.8)
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .style("fill", d => color(d.values))
    .on("mouseover", (event, d1) => {
        returnData = data[0].find(d => d["Team Name"] === d1["Team Name"])
        var customEvent = new CustomEvent("heatmapHovered", { detail: [returnData.X1, returnData.X2] });
        document.dispatchEvent(customEvent);

        highlightHeatmapX
            .attr("x", x(d1["Team Name"]))
            .attr("opacity", 1);

        highlightHeatmapY
            .attr("y", y(d1.vars))
            .attr("opacity", 1);
    })
    .on("mouseout", (event, d) => {
        var customEvent = new CustomEvent("noScatterHover");
        document.dispatchEvent(customEvent);

        highlightHeatmapX
            .attr("opacity", 0);

        highlightHeatmapY
            .attr("opacity", 0);
    });

heatmapTeams.data(data[1])
    .on("mouseover", (event, d1) => {
        returnData = data[0].find(d => d["Team Name"] === d1["Team Name"])
        var customEvent = new CustomEvent("heatmapHovered", { detail: [returnData.X1, returnData.X2] });
        document.dispatchEvent(customEvent);

        highlightHeatmapX
            .attr("x", x(d1["Team Name"]))
            .attr("opacity", 1);
    })
    .on("mouseout", (event, d) => {
        var customEvent = new CustomEvent("noScatterHover");
        document.dispatchEvent(customEvent);

        highlightHeatmapX
            .attr("opacity", 0);
    });


heatmapVars.data(data[1])
    .on("mouseover", (event, d) => {
        highlightHeatmapY
            .attr("y", y(vars[d["Team ID"] - 1]))
            .attr("opacity", 1);
    })
    .on("mouseout", (event, d) => {
        highlightHeatmapY
            .attr("opacity", 0);
    });

var highlightHeatmapX = svg.append('rect')
    .attr("id", "highlightHeatmapX")
    .attr("width", x.bandwidth())
    .attr("height", height - margin.top - margin.bottom)
    .attr("transform", `translate(0, ${margin.top})`)
    .attr("x", 0)
    .attr("y", 0)
    .attr("rx", 4)
    .attr("ry", 4)
    .attr("opacity", 0)
    .attr("fill", "none")
    .attr("stroke", 'red')
    .attr("stroke-width", 2);

var highlightHeatmapY = svg.append('rect')
    .attr("id", "highlightHeatmapY")
    .attr("width", width - margin.left - margin.right)
    .attr("height", y.bandwidth())
    .attr("transform", `translate(${margin.left}, 0)`)
    .attr("x", 0)
    .attr("y", 0)
    .attr("rx", 4)
    .attr("ry", 4)
    .attr("opacity", 0)
    .attr("fill", "none")
    .attr("stroke", 'red')
    .attr("stroke-width", 2);

document.addEventListener("scatterplotHovered", (event) => {
    var hoveredData = event.detail;

    highlightHeatmapX
        .attr("x", x(hoveredData))
        .attr("opacity", 1)
});

document.addEventListener("noHover", (event) => {
    highlightHeatmapX
        .attr("opacity", 0)
});