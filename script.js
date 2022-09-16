
function showAside()
{
    console.log(document.getElementById("sidebar").style.visibility)
    if(document.getElementById("sidebar").style.visibility =='visible')
    {
        console.log('showing sidebar');
        document.getElementById("sidebar").style.visibility='hidden'
    }else
    {
     console.log("hiding sidebar");
     document.getElementById("sidebar").style.visibility="visible"
    }
}
document.addEventListener('DOMContentLoaded', function(){
const AB_URL ="https://eugenelapanik.com/dashboard/json/"

    d3.json(AB_URL+"dnt.json").then((d)=>{
     
        let divWidth = document.getElementById("donut-container").offsetWidth
        console.log("div width of donut part",document.getElementById("donut-container"))
        if(divWidth == 180){

            drawNestedDonut(d["first_ring"],40,80,90)
            drawNestedDonut(d["second_ring"],0,38,90)
           }  else if(divWidth <231)
        {
            drawNestedDonut(d["first_ring"],60,110,115)
            drawNestedDonut(d["second_ring"],20,58,115)

       } 
       else{
     drawNestedDonut(d["first_ring"],80,120,125)
     drawNestedDonut(d["second_ring"],38,78,125)
    }
           


    }).catch(err=>{throw err;})
   
   function drawNestedDonut(data,inRadius,outRadius,centerPoint)
   {
    let doughnutChart = d3.select("#doughnut").append("g").attr("transform","translate("+centerPoint+","+centerPoint+")") 
        
    
    let first_ring_datamap = data.map((d)=>{return d.value});
   

    console.log("first ring data >",data);
    let pie = d3.pie().sort(null).value((d)=>{return d.value});
    console.log("pie() transform data to >",pie(data));

    //https://schoolofdata.org/2013/10/01/pie-and-donut-charts-in-d3-js/
    //https://codepen.io/pankajkumar005/pen/RPOeNV?editors=0010
    let arc = d3.arc()
                .innerRadius(inRadius)
                .outerRadius(outRadius)

    const colors = d3.scaleOrdinal(d3.schemeAccent);
 
    doughnutChart.selectAll("path").data(pie(data)).enter().append("path")
                                .attr('fill',(d)=>{console.log("colors >",colors(d.value)); return colors(d.value)})
                                .transition().delay((d,i)=>{return i*100;})
                                .duration(300)
                                .attr("d", arc)
                                .attr("stroke","black")
                                .attr("stroke-width",0.5);
    //https://d3-graph-gallery.com/graph/pie_annotation.html
    // https://stackoverflow.com/questions/45105203/how-to-rotate-text-around-its-centroid-vertically-flip-in-svg-d3
    let dg = doughnutChart.append("g")
                dg.selectAll("text").data(pie(data)).enter().append('text').text((d)=>{return d.data.name})
                .attr("transform",(d,i)=>{
                 
                    var rotation = d.endAngle < Math.PI ? 
                    (d.startAngle/2 + d.endAngle/2) * 180/Math.PI : 
                    (d.startAngle/2  + d.endAngle/2 + Math.PI) * 180/Math.PI ;
                    let x = arc.centroid(d)[0]-10;
                    let y = arc.centroid(d)[1]
                    return "translate("+x+","+y+") "})
               
   }
 




    d3.json(AB_URL+"barchart.json").then((_data)=>{
        
        let barchart = d3.select("#barchart");
 
        console.log('bar chat loading');
      
           
        let data = _data.data
        console.log(data)

        let y = d3.scaleLinear()
        .domain([0,80])
        .range([80,0])

        let svgrect = document.getElementById("barchart").getBoundingClientRect();
        let x = d3.scaleBand()
          .range([0,svgrect.width])
          .domain(data.map((d)=>{return d.name;}))
          .padding(1)

        console.log(data.map((d)=>{return d.name;}));
        //add x-axis
        //labels customization 
        let xbot = d3.axisBottom(x).tickSize(0)
        barchart.append('g')
                .attr('transform',"translate(0,80)")
                .call(xbot)
                .selectAll("text").attr("transform","translate(0,6)");
                

        // add bars to barchart 
        barchart.selectAll('rect').data(data).enter()
        .append("rect")
        .attr("x",(d)=>{return x(d.name)})
       // .attr("y",(d)=>{return y(d.value)})
       .attr("y",(d)=>{return y(0)})
        .attr('width',10)
        //.attr('height',(d)=>{return d.value})
        //.attr('height',(d)=>{return d.value - y(0)})
        .attr('class','bar')
        
        //animation of barchart 
        //https://d3-graph-gallery.com/graph/barplot_animation_start.html
        barchart.selectAll('rect').transition().duration(400)
                .attr('y',(d)=>{return y(d.value)})
                .attr('height',(d)=>{return d.value})
                .delay((d,i)=>{return i*100})

        //add labels to barchart above every bar. 
        barchart.selectAll('.bar-font').data(data).enter()
         .append('text')
         .attr('fill','black')
         .classed('bar-font',true)
         .attr("x",(d)=>{return x(d.name)-5})
         .attr("y",(d)=>{return y(d.value)-3})
         .text(d=>d.value+" M")


    }).catch((err)=>err)

    // make line charts

    let lineChart = d3.select("#linechart");

    d3.json(AB_URL+"linechart.json").then(
    (_data)=>{

        data = _data.data;
        console.log(data);
        years = data.map((d)=>{return {"year":d3.timeParse("%Y-%m-%d")(d.year),'value':d.value}})
        let targets = _data.target.map((d)=>{return {"year":d3.timeParse("%Y-%m-%d")(d.year),'value':d.value}});
        yearsYears = data.map((d)=>{return {"year":d3.timeParse("%Y")(d.year)}})
       // d3.timeParse("%Y-%m-%d")(d.date)

       let svgrect = document.getElementById("linechart").getBoundingClientRect();
        let x = d3.scaleTime()
        //d3.extent return min and max values. 
                    .domain(d3.extent(years,d=>{return d.year}))
                    .range([10,svgrect.width]);

      
        let y= d3.scaleLinear()
                .range([80,0])
                .domain([0,100])
        console.log(d3.extent(years,d=>{return d.year}))
        // lineChart.append('path')
        // .datum(years)
        // .attr('fill','none')
        // .attr('stroke','steelblue')
        // .attr('stroke-width',1.5)
        // .attr("d",d3.line()
        //             .x((d)=>{return x(d.year);})
        //             .y((d)=>{return y(d.value)}))
        DrawLineChart(years,x,y,'steelblue')
        DrawLineChart(targets,x,y,'black')

        let xbot = d3.axisBottom(x).tickSize(0).tickFormat(d3.timeFormat('%b')).ticks(12);
        lineChart.append("g").attr("transform","translate(0,90)").call(xbot);
      
      
      
        let xbotYears = d3.axisBottom(x).ticks(2).tickFormat(d3.timeFormat('%Y')).tickSizeInner(0).tickSizeOuter(0)
        lineChart.selectAll('.tick').selectAll('line').remove();
        lineChart.append("g").attr("transform","translate(0,100)").call(xbotYears).call(g => g.select(".domain").remove())

        let legend = lineChart.append("g").attr("transform","translate(10,10)");
        legend.append("rect").attr("width",20).attr("height",3).attr('x',0).attr("y",0).attr("rx",1).attr("fill","steelblue");
        legend.append("rect").attr("width",20).attr("height",3).attr('x',0).attr("y",10).attr("rx",1).attr("fill","black");
        legend.append("text").attr("x",23).attr("y",3).attr("fill","black").text("Actual");
        legend.append("text").attr("x",23).attr("y",15).attr("fill","black").text("Target");


    }).catch((err)=>{throw err;})

    //donut pogress chart 
    //https://codepen.io/adeveloperdiary/pen/EVrwJB?editors=0010
   

    d3.json(AB_URL+"gaps.json").then(d=>{
        gapsRight("#gap1",d,0)
        gapsRight("#gap2",d,1)
        gapsRight("#gap3",d,2)
        gapsRight("#gap4",d,3)

        

    }


    ).catch(err => {throw err})

    //bottom line + bar chart 
    d3.json(AB_URL+"bottom-chart.json").then(d=>{

    let chart = d3.select("#bottom-chart");
    let _data = d.data;
    console.log(_data.map((d)=>{return d.name}))

    ///https://stackoverflow.com/questions/18147915/get-width-height-of-svg-element
    let svgrect = document.getElementById("bottom-chart").getBoundingClientRect()
    let x = d3.scaleBand().range([10,svgrect.width]).domain(_data.map((d)=>{return d.name}));
    //  let x = d3.scaleBand().range([0,300]).domain(data.map((d)=>{return d.name;})).padding(1)



    let y = d3.scaleLinear().range([80,0]).domain([0,10]);
    
    // add line chart 
    let linepath = chart.append("path").datum(_data).attr("fill","none").attr("stroke-width",1).attr("d",d3.line()
    .x((d)=>{return x(d.name)+15})
    .y((d)=>{return y(d.value)})).classed("line-chart",true)
    
    //animation of line chart 
   
    lineChartAnimation(linepath,1200)
  
    

    // add bars
    chart.selectAll("rect").data(_data).enter()
        .append("rect").attr("x",d=>{return x(d.name)})
                        .attr("y",d=>{console.log( y(d.value));return y(0)})
                        .attr("width",25)
                        .attr("height",0)
                        .classed("line-chart-bar",true);
    chart.selectAll('rect').transition().duration(300)
            .attr('y',(d)=>{return y(d.value)})
            .attr('height',2)
            .delay((d,i)=>{return i*80})
 
         // labels above chart points. 
        chart.selectAll('.bar-font').data(_data).enter()
        .append('text')
        .attr('fill','black')
        .classed('bar-font',true)
        .attr("x",(d)=>{return x(d.name)+10})
        .attr("y",(d)=>{return y(d.value)-3})
        .text(d=>d.value)

        // x axis of bottom chart 
        let xbot = d3.axisBottom(x).tickSize(0)
        chart.append('g')
                .attr('transform',"translate(0,80)")
                .call(xbot)
                .selectAll("text").attr("transform","translate(-20,6)").classed("xaxis-bottom",true);
      chart.selectAll('.xaxis-bottom').each(insertLinebreaks);

    }).catch(err=>{throw err});

    function gapsRight(id,d,i)
    {
        let _gap = d3.select(id);
        let arc = d3.arc().innerRadius(35).outerRadius(40);
        //donut back
       // _gap.append("path").attr("d", arc).attr('transform',"translate(50,50)");
        //donut, active data
        _data = [d.data[0].value,(100-d.data[i].value)]
        
        const colors = d3.scaleOrdinal().domain(_data).range(['purple','rgb(221, 221, 221)']);
        //_data  
        let pie = d3.pie()(_data);
        console.log(pie)
        _gap.selectAll("path").data(pie).enter().append("path").attr('transform',"translate(50,50)")
        .attr("fill",(d)=>{console.log(d.value,colors(d.value)); return colors(d.value) })
        .transition()
        //animation 
        //https://stackoverflow.com/questions/34434127/d3-js-smooth-transition-on-arc-draw-for-pie-chart
        .delay((d,i)=>{return i*100})
        .duration(800)
        .attrTween('d',(d)=>{
            let i = d3.interpolate(d.startAngle+0.1,d.endAngle)
            return (t)=>{ d.endAngle = i(t); return arc(d)}
        })
       // .attr("d",arc)
            
        let valueToShow = 100-d.data[i].value
        let textToGat = _gap.append("g").attr("transform","translate("+(valueToShow<10 ? 35 :  24)+",60)");
        textToGat.append("text").text(valueToShow+"%").classed("gap-text",true);

       
    }

    function DrawLineChart(data,x,y,color)
    {
        let lineChart = d3.select("#linechart");
        console.log("data in DrawLineChart function >",data)
        let linepath = lineChart.append('path')
        .datum(data)
        .attr('fill','none')
        .attr('stroke',color)
        .attr('stroke-width',2)
        .attr("d",d3.line()
                    .x((d)=>{return x(d.year);})
                    .y((d)=>{return y(d.value)}))
    
        lineChartAnimation(linepath,700)
       

    }
    function lineChartAnimation(linepath,_duration)
    {
         //https://2k8618.blogspot.com/2014/10/simple-line-chart-using-d3-js-with.html
        let animlineLength = linepath.node().getTotalLength()
        linepath.attr("stroke-dasharray",animlineLength+ " "+animlineLength)
        linepath.attr( "stroke-dashoffset",animlineLength)
            .transition() // Call Transition Method
            .duration(_duration) // Set Duration timing (ms)
            .delay((d,i)=>{return i*100})
            .ease(d3.easeLinear) // Set Easing option
            .attr("stroke-dashoffset", 0);
                
    }

//https://itecnote.com/tecnote/javascript-how-to-include-newlines-in-labels-in-d3-charts/
    function insertLinebreaks (d) {
        var el = d3.select(this);
        var words = d.split(' ');
        el.text('');
        console.log("1");
        for (var i = 0; i < words.length; i++) {
            var tspan = el.append('tspan').text(words[i]);
            if (i > 0)
                tspan.attr('x', 0).attr('dy', '15');
        }
    };
  
    
    
})