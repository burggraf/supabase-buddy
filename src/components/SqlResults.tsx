import { IonGrid, IonRow, IonCol, IonLabel, useIonModal, IonButton, IonButtons, IonHeader, IonIcon, IonTitle, IonToolbar, IonContent } from '@ionic/react';
import './SqlResults.css'
import { UtilsService } from '../services/utils.service';
import { useState } from 'react';
import { closeOutline } from 'ionicons/icons';
const utilsService = new UtilsService();
interface ContainerProps {
  results: any[]
}

  
const SqlResults: React.FC<ContainerProps> = ({ results }) => {
    const [record, setRecord] = useState({});
    const [present, dismiss] = useIonModal((
        <>
        		<IonHeader>
					<IonToolbar>
						<IonTitle>Record Details</IonTitle>
						<IonButtons slot='end'>
							<IonButton color='primary' onClick={() => dismiss()}>
								<IonIcon size='large' icon={closeOutline}></IonIcon>
							</IonButton>
						</IonButtons>
					</IonToolbar>
				</IonHeader>   
                <IonContent className="ion-padding">
                    <IonGrid>
                    {
                     Object.keys(record as any).map((key, index) => {
                        return (
                            <IonRow>
                                <IonCol size="3" className="breakItUp">{key}</IonCol>
                                <IonCol size="9" className="breakItUp">{(record as any)[key]}</IonCol>
                            </IonRow>)
                    })}
                    </IonGrid>
                </IonContent>     
        </>
    ), {
        onDismiss: () => {
          console.log('dismissed');
        }
      });
  const outputArray = [];
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
                <IonLabel key={utilsService.randomKey()} className="resultHeader"><strong>Result #{i+1}</strong></IonLabel>
                <IonGrid key={utilsService.randomKey()}>
                    <IonRow key={utilsService.randomKey()}>
                        {keys.map((key, index) => (                            
                            <IonCol className="breakItUp" key={utilsService.randomKey()}><strong>{key}</strong></IonCol>
                        ))}
                    </IonRow>
                    {resultJson.map((row, index) => (
                        <IonRow key={utilsService.randomKey()} 
                            onClick={()=>{setRecord(row);present({

                            })}}>
                            {keys.map((key, index) => {
                                if (!Array.isArray(row[key])) {
                                    return (
                                        <IonCol className="breakItUp boxed" key={utilsService.randomKey()}>{row[key]}</IonCol>
                                        )
                                } else {
                                    return (
                                        <IonCol className="breakItUp boxed" key={utilsService.randomKey()}>{JSON.stringify(row[key])}</IonCol>
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
            <IonGrid key={utilsService.randomKey()}>
                <IonRow className="resultHeader" key={utilsService.randomKey()}>
                    <IonCol key={utilsService.randomKey()}><strong>Result #{i+1}</strong></IonCol>
                </IonRow>
                <IonRow key={utilsService.randomKey()}>
                    <IonCol key={utilsService.randomKey()}>
                        <IonLabel key={utilsService.randomKey()} className="error" color={parseInt(resultJson) === resultJson ? 'dark':'danger'}>{resultJson}</IonLabel>
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
