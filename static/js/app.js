// Author: Drew McKinney
// Creation Date: 2020-03-07
// Stomach-Strains



//  importing samples data
d3.json('../samples.json').then( (incomingData) => {
    

    // creating data items
    // patient ids
    var dataNames = incomingData.names
    // patient data
    var dataMeta = incomingData.metadata
    // patient results
    var dataSamples = incomingData.samples


    // selecting the dropdown menu
    var dropdownMenu = d3.select("#selDataset");

    // selecting the bar plot
    var BAR = d3.select('#bar').node()

    // selecting the bubble plot
    var BUBBLE = d3.select('#bubble').node()

    var GAUGE = d3.select('#gauge').node()

    // selecting meta data panel
    var META = d3.select('#sample-metadata')

    // injecting dropdownmenu selection into html
    dataNames.forEach(name => {
        dropdownMenu.append('option').attr('value', name).text(name)
    });

    
    // initialization of page view
    function init() {

        // selecting inital dataset
        var initID = dataNames[0]
        var initMeta = dataMeta.filter( patient => patient.id === parseInt(initID))
        var initSamples = dataSamples.filter( item => item.id === initID)

        // extracting sample data
        var initIDs = initSamples[0].otu_ids
        var initLabels = initSamples[0].otu_labels
        var initValues = initSamples[0].sample_values

        // outputting meta data to demographic html
        Object.keys(initMeta[0]).forEach( key => {
            META.append('p').classed('metaChild', true).text(`${key}: ${initMeta[0][key]}`)
        })

        /////////////////////////////
        //       BUBBLE PLOT       //
        /////////////////////////////

        // creating bubble plot trace
        var traceBubble = {
            mode: 'markers',
            x: initIDs,
            y: initValues,
            text:  initLabels,
            marker: {color: initIDs, size: initValues}
        }

        // formatting bubble plot layout
        var bubbleLayout = {
            title: 'Occurance by OTU ID',
            xaxis: {title: 'OTU ID'},
            hovermode: 'closest'
        }

        // forming plot data array
        var plotBubble = [traceBubble]

        // creating bubble plot
        Plotly.newPlot(BUBBLE, plotBubble, bubbleLayout)



        /////////////////////////////
        //         BAR PLOT        //
        /////////////////////////////

        // manipulating data for bar plotting
        var barIDs = initIDs.slice(0, 10).map( label => 'OTU ' + String(label)).reverse()
        var barValues = initValues.slice(0, 10).reverse()
        var barLabels = initLabels.slice(0, 10).reverse()

        // creating bar plot trace
        var traceBar = {
            type: 'bar',
            orientation: 'h',
            y: barIDs,
            x: barValues,
            text: barLabels
        }

        // formatting bar plot layout
        var barLayout = {
            title: 'Top 10 OTUs by Count'
        }

        // forming plot data array
        var plotBar = [traceBar]

        // creating bar plot
        Plotly.newPlot(BAR, plotBar, barLayout)

        /////////////////////////////
        //       GAUGE PLOT        //
        /////////////////////////////

        var initWashFreq = initMeta[0].wfreq

        var traceGauge = {
            type: 'indicator',
            mode: 'gauge+number',
            title: 'Wash Frequency',
            value: initWashFreq,
            gauge: {
                axis: { range: [0, 9], tickwidth: 1, tickcolor: 'green'},
                steps: [
                    { range: [0, 1], color: 'rgba(0, 0, 0, 0)'},
                    { range: [1, 2], color: 'rgba(0, 255, 0, 0.25)'},
                    { range: [2, 3], color: 'rgba(0, 255, 0, 0.5)'},
                    { range: [3, 4], color: 'rgba(0, 255, 0, 0.75)'},
                    { range: [4, 5], color: 'rgba(0, 225, 0, 1)'},
                    { range: [5, 6], color: 'rgba(0, 175, 0, 1)'},
                    { range: [6, 7], color: 'rgba(0, 125, 0, 1)'},
                    { range: [7, 8], color: 'rgba(0, 75, 0, 1)'},
                    { range: [8, 9], color: 'rgba(0, 50, 0, 1)'}
                ],
                
            }
        }

        var plotGauge = [traceGauge]

        Plotly.newPlot(GAUGE, plotGauge)
    }


    // calling plot update on dropdown menu change event
    dropdownMenu.on('change', updatePlot)



    function updatePlot() {

        // selecting updated dataset
        var updID = dropdownMenu.property("value");
        var updMeta = dataMeta.filter( patient => patient.id === parseInt(updID))
        var updSamples = dataSamples.filter( item => item.id === updID)
        
        // extracting sample data
        var updIDs = updSamples[0].otu_ids
        var updLabels = updSamples[0].otu_labels
        var updValues = updSamples[0].sample_values

        // removing previous meta data from html
        d3.selectAll('.metaChild').remove()

        // outputting meta data to demographic html
        Object.keys(updMeta[0]).forEach( key => {
            META.append('p').classed('metaChild', true).text(`${key}: ${updMeta[0][key]}`)
        })

        /////////////////////////////
        //       BUBBLE PLOT       //
        /////////////////////////////

        // restyling bubble plot to new values
        Plotly.restyle(BUBBLE, 'x', [updIDs])
        Plotly.restyle(BUBBLE, 'y', [updValues])
        Plotly.restyle(BUBBLE, 'text', [updLabels])

        /////////////////////////////
        //         BAR PLOT        //
        /////////////////////////////

        // manipulating data for bar plotting
        var barIDs = updIDs.slice(0, 10).map( label => 'OTU ' + String(label)).reverse()
        var barValues = updValues.slice(0, 10).reverse()
        var barLabels = updLabels.slice(0, 10).reverse()

        // restying bar plot to new data
        Plotly.restyle(BAR, 'x', [barValues])
        Plotly.restyle(BAR, 'y', [barIDs])
        Plotly.restyle(BAR, 'text', [barLabels])    


        /////////////////////////////
        //       GAUGE PLOT        //
        /////////////////////////////

        var gaugeValue = updMeta[0].wfreq

        Plotly.restyle(GAUGE, 'value', [gaugeValue])

    }

    init()
    })


