import numpy as np
import urllib.request
import time
import sys
import cv2
import requests
import re

time_list = []
time_interval = 0.25 * 60 # a cada 15s

def center(x, y, w, h):
    x1 = int(w / 2)
    y1 = int(h / 2)
    cx = x + x1
    cy = y + y1
    return cx,cy

camera_ip = str(sys.argv[1])
camera_id = str(sys.argv[2])
token = str(sys.argv[3])

cap = cv2.VideoCapture(camera_ip) 

fgbg = cv2.createBackgroundSubtractorMOG2()

detects = []

posL = 100
offset = 30

xy1 = (0, posL)
xy2 = (300, posL)


total = 0

inside = 0
outside = 0

time_start = time.time()
while 1:
    ret, frame = cap.read()
    
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    #cv2.imshow("gray", gray)

    fgmask = fgbg.apply(gray)
    #cv2.imshow("fgmask", fgmask)

    retval, th = cv2.threshold(fgmask, 200, 255, cv2.THRESH_BINARY)
    #cv2.imshow("th", th)

    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))

    opening = cv2.morphologyEx(th, cv2.MORPH_OPEN, kernel, iterations = 2)
    #cv2.imshow("opening", opening)

    dilation = cv2.dilate(opening,kernel,iterations = 8)
    #cv2.imshow("dilation", dilation)

    closing = cv2.morphologyEx(dilation, cv2.MORPH_CLOSE, kernel, iterations = 8)
    #cv2.imshow("closing", closing)

    cv2.line(frame,xy1,xy2,(255,0,0),3)

    cv2.line(frame,(xy1[0],posL-offset),(xy2[0],posL-offset),(255,255,0),2)

    cv2.line(frame,(xy1[0],posL+offset),(xy2[0],posL+offset),(255,255,0),2)

    contours, hierarchy = cv2.findContours(dilation,cv2.RETR_TREE,cv2.CHAIN_APPROX_SIMPLE)
    i = 0
    for cnt in contours:
        (x,y,w,h) = cv2.boundingRect(cnt)

        area = cv2.contourArea(cnt)

        if int(area) > 3000 :
            centro = center(x, y, w, h)

            cv2.putText(frame, str(i), (x+5, y+15), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 255),2)
            cv2.circle(frame, centro, 4, (0, 0,255), -1)
            cv2.rectangle(frame,(x,y),(x+w,y+h),(0,255,0),2)
            if len(detects) <= i:
                detects.append([])
            if centro[1]> posL-offset and centro[1] < posL+offset:
                detects[i].append(centro)
            else:
                detects[i].clear()
            i += 1

    if i == 0:
        detects.clear()

    i = 0

    if len(contours) == 0:
        detects.clear()

    else:

        for detect in detects:
            for (c,l) in enumerate(detect):


                if detect[c-1][1] < posL and l[1] > posL :
                    detect.clear()
                    outside+=1
                    total = inside - outside
                    cv2.line(frame,xy1,xy2,(0,255,0),5)
                    continue

                if detect[c-1][1] > posL and l[1] < posL:
                    detect.clear()
                    inside+=1
                    total = inside - outside
                    cv2.line(frame,xy1,xy2,(0,0,255),5)
                    continue

                if c > 0:
                    cv2.line(frame,detect[c-1],l,(0,0,255),1)

    cv2.putText(frame, "TOTAL: "+str(total), (10, 20), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 255),2)
    cv2.putText(frame, "ENTRANDO: "+str(inside), (10, 40), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0),2)
    cv2.putText(frame, "SAINDO: "+str(outside), (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255),2)

    cv2.imshow("frame", frame)

    current_time = time.time()
    current_interval = current_time - time_start
    
    if(current_interval >= time_interval): # a cada X min ele envia uma informaçõa
        time_start = time.time()

        requests.post("http://localhost:8000/locations/update/total",json = {
            "camera_id" : camera_id,
            "new_amount" : str(total)
        }, headers={'Authorization': f'{token}'})

        sys.stdout.flush()

    if cv2.waitKey(30) & 0xFF == ord('q'):
        break

requests.put("http://localhost:8000/cameras",json = {
    "camera_id" : camera_id,
    "atribute" : {
        "status" : 0
    }
}, headers={'Authorization': f'{token}'})

cap.release()
cv2.destroyAllWindows()