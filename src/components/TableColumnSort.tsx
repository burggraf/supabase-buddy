import { IonIcon } from '@ionic/react';
import { caretDownOutline, caretUpOutline } from 'ionicons/icons';
import './TableColumnSort.css';
//<{orderBy: string, ascending: boolean}>
interface Sort {
    orderBy: string;
    ascending: boolean;
}
interface ContainerProps {
    sort: Sort;
    columnName: string;
    callback: Function;
}

const TableColumnSort: React.FC<ContainerProps> = ({ sort, columnName, callback }) => {
    const changeSort = async () => {
        if (sort.orderBy === columnName) {
            sort.ascending = !sort.ascending;
        } else {
            sort.orderBy = columnName;
            sort.ascending = true;
        }
        callback(sort);
    };
        return (
        <IonIcon icon={sort.ascending || sort.orderBy !== columnName ? caretUpOutline : caretDownOutline} 
        // onClick={() => {changeSort();}}
        size="large"
        onClick={changeSort}
        color={columnName === sort.orderBy ? 'dark' : 'medium'}></IonIcon> 
      );
    };

export default TableColumnSort;
