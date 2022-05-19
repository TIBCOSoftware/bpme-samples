## Telephone Number Masking 
Format XXX-XXX-XXX
```
var phone = control.phoneNumber.value;
if(phone != null && phone != ""){
 //verify it is in the format 888-888-8888
 var strippedPhone = '';
	var strippedPhone = '';
	for(var i=0; i<phone.length; i++){
  		var c = phone.charAt(i);
  		var isNonDigitChar = isNaN(parseInt(c));
  		if(!isNonDigitChar){ // check if c is a digit
    		strippedPhone += c;
  		}
	}	
	strippedPhone.length == 10;
} else{
    true;
}
