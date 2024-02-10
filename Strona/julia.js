
self.addEventListener('message', function(e) {
        animate();
    });

function animate(){
        var creal = -.4
        var cimag = .156;
        var frame = 0;
        
        var pallette=[]; //an array that stores the RGB combinations
        
        function julia()
        {
                for(y=0;y<200;y++)
                        {
                        for(x=0;x<200;x++)
                                {
                                var cx=-2+x/50;
                                var cy=-2+y/50;
                                var i = 0;
        
                                do
                                        {
                                        xt=cx*cx-cy*cy+creal;
                                        cy=2*cx*cy+cimag;
                                        cx=xt;
                                        i++;
                                        }
                                while ((cx*cx+cy*cy<4)&&i<25);
        
                                //i=i.toString(16); - commented out since not needed in this version
                                result = {
                                        x:x,
                                        y:y,
                                        pallette:pallette
                                }
                                        self.postMessage(result);
                                }
                        }
                frame++;
                creal=-.8+.6*Math.sin(frame/(3.14*20));
                cimag=.156+.4*Math.cos(frame/(3.14*40));
                
        }
        
        for(x=0;x<9;x++) // this loop populates the color pallette array
                {
                color=(31*x).toString(16); // convert the number to hex
                if(color.length==1) color='0'+color;  // add a zero in front if only one hex digit
                pallette[x]="#"+'00001d'; // colors 0-8: the Red and Green components change, Blue=FF
                pallette[x+8]='#7fffd4';      // colors 8-16: the Blue component changes, Red and Green=FF
                pallette[17+x]="#"+'00000f';  // colors 17-25: the Red component changes, Green and Blue=0
                }
        
        a=setInterval(julia,0.5);
}