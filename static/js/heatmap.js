var margin = ({top: 30, right: 30, bottom: 60, left: 150});
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
    .range([ margin.left, width - margin.right ])
    .domain(groups)
    .padding(0.01);
svg.append("g")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(d3.axisBottom(x))
    .selectAll("text")  
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-65)");


var y = d3.scaleBand()
    .range([ height - margin.bottom, margin.top ])
    .domain(vars)
    .padding(0.01);
svg.append("g")
    .attr("transform", `translate(${margin.left}, 0)`)
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