# Fresh air without poisons project - "Větrání bez jedů"

Repository of Czech Pirate Party project aiming at publicizing air quality situation, informing about problematic industrial polluters to force dialogue using inform - analyze - act approach.

## Background
City of Ostrava is formerly industrial city. During the past industry (ironworks, coal mining and related fields) played a major role in the city development. However, in the 1990s all the mining activity there ceased and also one of the two facilities for production of raw iron was closed. In 2000s the old ironworks were remade into cultural site now hosting big events like Colours of Ostrava. The city in now in the process of transition into knowledge economy and is the 3rd most important technology hub in Czech Republic.

However, the other iron- and steelworks are still in operation and are responsible for unacceptable air quality situation in nearby neighbourhood of Radvanice and Bartovice. One of the most problematic source in the works is the coking plant (1500 kt/a capacity), which emits vast quantities of carcinogenic benzo(a)pyrene.

Other problematic polluter is the Svoboda coking works. This facility established in 1907 produces ~800 kilitons of various types of coke per annum and is situated in Přívoz neighbourhood. Air quality situation in Přívoz is unacceptable by the Czech legal standard. Emissions and odor from this factory make conditions in its vicinity unbearable and are devastating its neighbourhood (which is already problematic), which is adjacent to the city center. On days with the right wind the odor can be smelled all over the city center. Pollution from this facility makes new development in the area of city center problematic and is making hurdles in city transition into knowledge economy.

Third problematic polluter are BorsodChem chemical works which are causing odor problems in the surrounding industrial area and are a major emittent of benzene. 

We know that there's also a major problem with small domestic heaters in the nearby villages and crossborder pollution. But having crossborder pollution should not freeze our activities to curb the domestic one and try to reach the legal limits.

## Web app
Web application hosted from this repo enables inhabitants of city of Ostrava to discover where the polluted air from the industry is blowing and where it'll blow. Using these data inhabitants can identify sources of stinky emissions and avoid them by closing their windows when particular wind direction is forecasted.

Web application hosted from this repository has following components:

* Periodic downloading of DWD ICON wind speed and direction forecast data from DWD opendata server and storing them into database (dloader component)
* Presentation of stored wind data as REST service
* Frontend for visualisation of wind direction data using mapy.cz open API

