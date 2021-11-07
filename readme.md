# ReMin Receiver

## What is it?

This is a prototype for a proxy between ReMin Vacination Management solution and openEHR. The solution provides a simple REST API to post vaccination request with a shared information model defined by a JSON schema.

The request is committed to the openEHR CDR by building a COMPOSITION and committing it with a CONTRIBUTION.

## Wanna try?

```bat 
npm run dev 
```

This starts the server on your localhost and listens on port `8080` . 
Unfortunately for this prototype this spins up a server talking to a local openEHR CDR in DIPS AS. It also uses the proprietary REST API for DIPS EHR Store. This was because of short time limits. You might fork the code to use the defined openEHR REST API instead.

## Clinical models 

The base openEHR model is the ACTION medication. The modelling is also a prototype and have to refined for production usage. 

Take a look at the template here: https://tools.openehr.org/designer/#/viewer/shared/Pz9zaGFyZWRJZD0xJGExM2MxNjAyZjZhMDRlMTRhMWRkMzliMTVmYWI2MGYw 

## Deployments

The service is hosted as a Kubernetes service and deployed to Azure. The address for the server will be shared later. 

## ReMin Demo

The ReMin demo application is located here: https://demo.remin.no/ 
