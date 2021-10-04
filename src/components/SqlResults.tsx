import { IonGrid, IonRow, IonCol, IonLabel } from '@ionic/react';
import './SqlResults.css'

interface ContainerProps {
  results: any[]
}

const SqlResults: React.FC<ContainerProps> = ({ results }) => {
    console.log('SqlResults got results', results);
  const outputArray = [];
  let uniqueKey = 0;
  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    let resultJson;
    try {
        resultJson = JSON.parse(result);
    } catch (err) {
        // console.error(`could not parse result #${i+1}`, result);
        resultJson = result;
    }
    // test if resultJson is an array
    if (resultJson && Array.isArray(resultJson)) {
        if (resultJson.length > 0) {
            // get keys and values of first element
            const keys = Object.keys(resultJson[0]);
            console.log('keys', keys);
            outputArray.push(
                <>
                <IonLabel className="resultHeader"><strong>Result #{i+1}</strong></IonLabel>
                <IonGrid key={i}>
                    <IonRow>
                        {keys.map((key, index) => (                            
                            <IonCol><strong>{key}</strong></IonCol>
                        ))}
                    </IonRow>
                    {resultJson.map((row, index) => (
                        <IonRow>
                            {keys.map((key, index) => (
                                <IonCol className="boxed">{row[key]}</IonCol>
                            ))}
                        </IonRow>
                    ))}
                </IonGrid>
                </>
            )
            // resultJson[0]
        }
    } else {
        outputArray.push(
            <IonGrid key={++uniqueKey}>
                <IonRow className="resultHeader" key={++uniqueKey}><IonCol key={++uniqueKey}><strong>Result #{i+1}</strong></IonCol></IonRow>
                <IonRow>
                    <IonCol><IonLabel className="error" color={parseInt(resultJson) === resultJson ? 'dark':'danger'}>{resultJson}</IonLabel></IonCol>
                </IonRow>
            </IonGrid>
        )

    }
    console.log('resultJson', typeof resultJson, resultJson);
  }
  console.log('outputArray', outputArray);
  return (
    <>
    {outputArray}
    </>
    // <div className='container'>
    //   <strong>{results}</strong>
    // </div>
  )
}

export default SqlResults
