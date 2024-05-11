var margin = ({top: 30, right: 30, bottom: 30, left: 30});
var width = 600;
var height = 400;

var svg = d3.select("#svg_heatmap")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transfrom", `translate(${margin.left}, ${margin.top})`);


var groups = d3.map(data[1], d => d["Team Name"]);
var vars = d3.map(data[1], d => d.vars);

var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(groups)
    .padding(0.01);
svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));


var y = d3.scaleBand()
    .range([ height, 0 ])
    .domain(vars)
    .padding(0.01);
svg.append("g")
    .call(d3.axisLeft(y));

var color = d3.scaleSequential()
    .interpolator(d3.interpolateInferno)
    .domain([d3.min(data[1], d => d.values), d3.max(data[1], d => d.values)]);

svg.selectAll()
    .data(data[1])
    .enter()
    .append("rect")
    .attr("x", d => x(d["Team Name"]))
    .attr("y", d => y(d.vars))
    .attr("width", x.bandwidth())
    .attr("height", y.bandwidth())
    .style("fill", d => color(d.values))