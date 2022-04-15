export function formatDate(time) {
    if(!time){
        return ''
    }
    let formatDate = new Date(time)
    let secend = formatDate.getSeconds()
    if(secend<10){
        secend = '0'+ formatDate.getSeconds()
    }
    return  formatDate.getFullYear() + '-' + (formatDate.getMonth()+1) +'-' + formatDate.getDate() + ' ' + formatDate.getHours() + ':' +formatDate.getMinutes() + ':' + secend 
}