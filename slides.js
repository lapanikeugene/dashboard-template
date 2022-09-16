let slide = 1; 
showNews(slide);

function nextNews(i)
{
    showNews(slide+=i);
}

function showNews(i=1)
{
   let x =  document.getElementsByClassName("some-news");
   if(i> x.length) slide = 1;
   else if(i<1) slide = x.length;


   for (let index = 0; index < x.length; index++) {
    x[index].style.display = "none";
    
   }
   x[slide-1].style.display="block";
}


