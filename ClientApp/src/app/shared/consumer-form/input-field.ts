
export class InputField {
    headerName: string;
    field: string;
    required?: boolean = false;
}

export const fields: InputField[] = [{ headerName: 'Name', field: 'name', required: true },
{ headerName: 'GSTIN', field: 'gstin' },
{ headerName: 'Address', field: 'address' },
{ headerName: 'Description', field: 'description' }];