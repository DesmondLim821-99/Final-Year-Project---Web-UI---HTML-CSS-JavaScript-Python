function myFunction10() 
{
    var x = document.getElementById("text_message").value == "";
    console.log(x)
    if(!x)
    {
        alert("Your message have been recorded! We will contact you shortly!");
    } 
}
