


const url = "wss://ws.kraken.com/"

const socket = new WebSocket(url)

const subscribe = {"event":"subscribe", "subscription":{"name":"ohlc"}, "pair":["XBT/USD"]}

const ask = document.getElementById("ask")
const bid = document.getElementById("bid")



let trades= []
let tradest = [] 
let highs = []
let lows = []



//websocket
socket.onmessage = function(event) {
    const message = JSON.parse(event.data)
    

   
    if (message.status == 'online'){
        socket.send(JSON.stringify(subscribe))

}
    if (message.event != 'heartbeat')    

    {   var servertime = Math.round( message[1][1] ) 
        var d = new Date();
        var h = d.getHours();
        var m = d.getMinutes();
        var s = d.getSeconds();

      

        if(s < 10){
                s = '0'+ s
        }
        if(m < 10){
                m = '0'+ m
        }
        if(h < 10){
                h = '0'+ h
        }


        var time = h + ":" + m + ":" + s + " " ;







        //Closeprice
        document.getElementById('close').innerHTML = message[1][5]
        

        //Askprice
        const askel = document.createElement('div')
        askel.className = 'askel'
        askel.innerHTML = time +'&nbsp &nbsp<b>'+ message[1][3] +'</b> &nbsp &nbsp ' +message[1][7]
        ask.appendChild(askel)
        var elements = document.getElementsByClassName('askel')
        if (elements.length > 10){
                ask.removeChild(elements[0])
        }


        //Bidprice
       
        const bidel = document.createElement('div')
        bidel.className = 'bidel'
        bidel.innerHTML = time +'&nbsp &nbsp<b>'+ message[1][4] +'</b> &nbsp &nbsp ' +message[1][7]
        bid.appendChild(bidel)
        var elements = document.getElementsByClassName('bidel')
        if (elements.length > 10){
                bid.removeChild(elements[0])
        }
  
        
        //Chartdata
        //Loops 9times for each entry in the array come back when u get the map funtion better
        let krakendata = message[1].map(s =>(
                {
                        time: servertime,
                        open: message[1][2],
                        high:message[1][3],
                        low:message[1][4],
                        close:message[1][5]
                }
        )
        )


      // Trades to chart 

        tradest.push(krakendata[1].time)
        trades.push(krakendata[1])
        highs.push(krakendata[1].high)
        lows.push(krakendata[1].low)

        if( new Set(tradest).size !== 1)
       { 
                var datatime = tradest[0]
                var open = trades[0].open
                var highdata = Math.max(...highs)
                var lowdata = Math.min(...lows)
                var close = trades[trades.length -1].close

                console.log(datatime,open,highdata,lowdata,close)

                tradest =[]
                trades =[]
                lows =[]
                highs =[]
                
               updateChart(datatime,open,highdata,lowdata,close)
          }
     


    }
} 



// disconnect after 2h ? 

function updateChart(time, open, high, low, close)
{
        candlestickSeries.update({
                time: time + 7200,
                open: open,
                high:high,
                low: low,
                close: close


        })
        console.log('NEW Candle')
}


        //REST API for historical data

        const userAction = async () => {
                
                const response = await fetch('https://api.kraken.com/0/public/OHLC?pair=XBTUSD');
                
                const hisdata = await response.json(); //extract JSON from the http response 

                hisdata.result.XXBTZUSD.forEach(element => {

                        updateChart(element[0],element[1],element[2],element[3],element[4])
                        
                });

               
              }
       
              userAction()

            


function connect(){

        console.log('clicked')
}



const chart = LightweightCharts.createChart(document.getElementById('chart'), { width: 700,
        height: 700,
            layout: {
                    backgroundColor: '#000000',
                    textColor: '#ffffff',
            },
            grid: {
                    vertLines: {
                            color: '#404040',
                    },
                    horzLines: {
                            color: '#404040',
                    },
            },
            crosshair: {
                    mode: LightweightCharts.CrosshairMode.Normal,
            },
            priceScale: {
                    borderColor: '#cccccc',
            },
            timeScale: {
                    borderColor: '#cccccc',
                    timeVisible: true, }} );


 
const candlestickSeries = chart.addCandlestickSeries();





chart.timeScale().fitContent();


// get new data in the right format ohlc data if subscribed https://docs.kraken.com/websockets/

