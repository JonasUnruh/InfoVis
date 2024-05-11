var margin = ({top: 20, right: 20, bottom: 20, left: 20});
var width = 600;
var height = 400;
    
var x = d3.scaleLinear()
    .range([ margin.left , width - margin.right]);

var y = d3.scaleLinear()
    .range([ height - margin.bottom, margin.top ]);


var svg = d3.select("#svg_scatter_plot")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transfrom", `translate(${margin.left}, ${margin.top})`);

x.domain([d3.min(data[0], d => d.X1), d3.max(data[0], d => d.X1)]).nice();
y.domain([d3.min(data[0], d => d.X2), d3.max(data[0], d => d.X2)]).nice();

svg.append("g")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(d3.axisBottom(x));

svg.append("g")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(d3.axisLeft(y));


var color = d3.scaleSequential()
    .domain([0, d3.max(data[0], d => d["Team ID"])])
    .interpolator(d3.interpolateViridis);

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Add dots
svg.append('g')
    .selectAll("dot")
    .data(data[0])
    .enter()
    .append("circle")
        .attr("cx", d =>  x(d.X1) )
        .attr("cy", d => y(d.X2) )
        .attr("r", 5)
        .style("fill", d => color(d["Team ID"]))
    .on("mouseover", (event, d) => {
        var [x, y] = d3.pointer(event)

        div.transition()
          .duration(100)
          .style("opacity", 1)
          
        div.html(d["Team Name"])
          .style("left", (x) + "px")
          .style("top", (y - 28) + "px")
    })
    .on("mouseout", d => {
        div.transition()
          .duration('200')
          .style("opacity", 0);
    });
