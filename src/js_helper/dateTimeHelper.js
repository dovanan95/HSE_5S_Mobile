const getDate =()=>{
    var homnay = new Date();
    var dd= String(homnay.getDate()).padStart(2, '0');
    var mm = String(homnay.getMonth()+1).padStart(2, '0');
    var yyyy=  homnay.getFullYear();
    homnay = yyyy+'-'+mm+'-'+dd;
    return(homnay);
}
export default (getDate);