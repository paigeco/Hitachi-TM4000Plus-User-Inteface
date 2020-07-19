getOK:

delay 10 '30 // Delay 10 milliseconds
c0 = getstrbyte(cmd,1) ' // Returns ascii code for the cmd, strings start at number 1

gokcount = 0            ' *****
while true
  gokcount++ '// Increase gokcount
  OKstr = ""   

  repeat
    checkserbuffer n '// checkserbuffer outputs how many bytes are in the serial buffer
  until n >= 3  '// continue if there are at least 3 bytes waiting NOTE:: this code appears to be blocking..
   
  delay 10 '30    ' wait for more chars if there
  SerIn OKstr  ' read in OK[CR][LF] or ER[CR][LF] if error
  OKcksm = 0 ' init checksum
  OKindx = 1 '  INDEXES BEGIN AT 1 AND IM MAD ABOUT IT

  if length(OKstr) > 2  ' if we got something, test it
    while OKindx < length(OKstr)-1 and getstrbyte(OKstr,OKindx) <> 13 ' 
      OKcksm += getstrbyte(OKstr,OKindx) ' 
      OKindx++                                  
    wend
  endif
     
  OKcksm = OKcksm&0xFF

  if length(OKstr) > 2 and OKcksm == getstrbyte(OKstr,length(OKstr))
     serout char(71)  ' send G for good
     break
  else
     serout char(66)  ' B for bad
  endif

  ClearSerBuffer
  delay 10 '20
  if gokcount >= 5
    xytext 450,550,"Bad Checksum - Power Down, Restart"
    while true
    wend
  endif
wend

if length(OKstr) < 3 then OKstr = "XX"+char(13)+char(10)

showOK = true   ' set to skip show 1st time
return