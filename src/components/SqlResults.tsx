import { IonGrid, IonRow, IonCol, IonLabel } from '@ionic/react';
import './SqlResults.css'

interface ContainerProps {
  results: any[]
}
const SqlResults: React.FC<ContainerProps> = ({ results }) => {
  const outputArray = [];
  const getUniqueKey = () => {
      return Math.random().toString(36).substr(2, 9);
  }
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
            outputArray.push(
                <>
                <IonLabel className="resultHeader"><strong>Result #{i+1}</strong></IonLabel>
                <IonGrid key={getUniqueKey()}>
                    <IonRow key={getUniqueKey()}>
                        {keys.map((key, index) => (                            
                            <IonCol key={getUniqueKey()}><strong>{key}</strong></IonCol>
                        ))}
                    </IonRow>
                    {resultJson.map((row, index) => (
                        <IonRow key={getUniqueKey()}>
                            {keys.map((key, index) => {
                                if (!Array.isArray(row[key])) {
                                    return (
                                        <IonCol key={getUniqueKey()} className="boxed">{row[key]}</IonCol>
                                        )
                                } else {
                                    return (
                                        <IonCol key={getUniqueKey()} className="boxed">{JSON.stringify(row[key])}</IonCol>
                                        )

                                }
                            }
                            )}
                        </IonRow>
                    ))}
                </IonGrid>
                </>
            )
            // resultJson[0]
        }
    } else {
        outputArray.push(
            <IonGrid key={getUniqueKey()}>
                <IonRow className="resultHeader" key={getUniqueKey()}>
                    <IonCol key={getUniqueKey()}><strong>Result #{i+1}</strong></IonCol>
                </IonRow>
                <IonRow key={getUniqueKey()}>
                    <IonCol key={getUniqueKey()}>
                        <IonLabel key={getUniqueKey()} className="error" color={parseInt(resultJson) === resultJson ? 'dark':'danger'}>{resultJson}</IonLabel>
                    </IonCol>
                </IonRow>
            </IonGrid>
        )

    }
  }
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
