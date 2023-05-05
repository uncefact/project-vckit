import React from 'react';
import { Create } from "@refinedev/mui";
import { Box, TextField, Checkbox, FormControlLabel, Select, MenuItem } from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";
import { JsonForms } from '@jsonforms/react';
import { materialRenderers, materialCells } from '@jsonforms/material-renderers';
import { JsonSchema } from '@jsonforms/core';

export const CredentialCreate = () => {
  const {
    saveButtonProps, // Props for the submit button
    refineCore: { formLoading }, // Loading state for the form
    handleSubmit,
    register, // Function for registering form fields with React Hook Form
    control, // Function for controlling the form state with React Hook Form
    formState: { errors }, // Object containing any form errors
  } = useForm(); // Initialize the form using React Hook Form

  const onSubmit = (data: any) => {
    // handle form submission here
    console.log('Form submitted:', data);
  };
  // Create an array of sample JSON schema objects
  const sampleSchemaObjects: Array<JsonSchema> = [
    { // Define the first schema object
      "title": "Login Form",
      "type": "object",
      "properties": {
        "username": {
          "type": "string",
          "title": "Username"
        },
        "password": {
          "type": "string",
          "title": "Password"
        }
      },
      "required": [
        "username",
        "password"
      ]
    },
    { // Define the second schema object
      "title": "Registration Form",
      "type": "object",
      "properties": {
        "firstName": {
          "type": "string",
          "title": "First Name"
        },
        "lastName": {
          "type": "string",
          "title": "Last Name"
        },
        "email": {
          "type": "string",
          "title": "Email"
        },
        "password": {
          "type": "string",
          "title": "Password"
        }
      },
      "required": [
        "firstName",
        "lastName",
        "email",
        "password"
      ]
    }
  ];

  // State to hold the currently selected schema object
  const [selectedSchemaObject, setSelectedSchemaObject] = React.useState(sampleSchemaObjects[0]);
  const [data, setData] = React.useState();

  const setSchemaObject = (object:any) => {
    console.log(object)
    setSelectedSchemaObject(object)
  }
  return (
    <Create isLoading={formLoading} saveButtonProps={{...saveButtonProps, onClick: onSubmit}}  >
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column" }}
        autoComplete="off"
      > 
          <Select
            labelId="schema-object-select-label"
            id="schema-object-select"
            value={selectedSchemaObject.title}
            onChange={(event) => {
                const selectedValue = event.target.value;
                const selectedObject = sampleSchemaObjects.find(obj => obj.title === selectedValue);
                // @ts-ignore
                setSchemaObject(selectedObject);
            }}
            >
            {sampleSchemaObjects.map((schemaObject, index) => (
                <MenuItem key={index} value={schemaObject.title}>{schemaObject.title}</MenuItem>
            ))}
            </Select>
            <JsonForms
                schema={selectedSchemaObject}
                data={data}
                renderers={materialRenderers}
                cells={materialCells}
                onChange={({ errors, data }) => setData(data)}
                />

        {/* When a schema object is selected, display the form using JSON Forms */}
        {/* Use the 'register' and 'control' functions to update the form state */}
      </Box>
      {/* Create a button to submit the form using React Hook Form */}
    </Create>
  );
};
