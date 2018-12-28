var loadDataEcharts = function (myChart) {
    $.get('js/hubei.json', function (geoJson) {
        myChart.hideLoading();
        echarts.registerMap('HuBei', geoJson);
        let option = {
            title: {
                text: '博学云驾驶仓',
                subtext: '各县学生分布',
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: '{b}<br/>{c}'
            },
            toolbox: {
                show: true,
                orient: 'vertical',
                left: 'right',
                top: 'center',
                feature: {
                    // dataView: {readOnly: true},
                    restore: {},
                    saveAsImage: {}
                }
            },
            visualMap: {
                min: 800,
                max: 50000,
                text:['High','Low'],
                realtime: false,
                calculable: true,
                inRange: {
                    color: ['lightskyblue','yellow', 'orangered']
                }
            },
            series: [{
                name: '活跃人数分布',
                type: 'map',
                map: 'HuBei',
                label: {
                    normal: {
                        show: true,
                        color: '#000'
                    },
                    emphasis: {
                        show: true
                    }
                },
                roam: true,
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                itemStyle: {
                    normal: {
                        areaColor: '#fff',
                        borderColor: '#6367ad',
                        borderWidth: 1
                    },
                    emphasis: {
                        areaColor: '#00FFFF'   // 这里修改选中颜色
                    }
                },
                data: []
            }]
        }
        $.ajax({ 
            url: "http://116.55.248.182:8081/api/Ast/GetBoxueyunStudent",
            dataType:'json',
            type:'get',
            success: function(data){
                // console.log(data.Result);
                let dataResult = [];
                let nameShort = [];

                for (let key in option.series[0].nameMap) {
                    nameShort.push(key);
                }
                for(let i in data.Result) {
                    let item = {};
                    if(nameShort.indexOf(data.Result[i].AREANAME) > -1) {
                        item.name = option.series[0].nameMap[data.Result[i].AREANAME];
                        item.value = data.Result[i].STUDENTCNT;
                        //item.value = Math.round(Math.random()*100000);
                    } else {
                        item.name = data.Result[i].AREANAME;
                        item.value = data.Result[i].STUDENTCNT;
                        //item.value = Math.round(Math.random()*50000);
                    }
                    dataResult.push(item);
                }
                option.series[0].data = dataResult;
            },
            complete: function(){
                myChart.setOption(option);
            }
        });
    });
}