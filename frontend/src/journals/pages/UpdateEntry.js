import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";

import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

import "./PlaceForm.css";

const UpdateEntry = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [loadedEntry, setLoadedEntry] = useState();
  const entryId = useParams().eid;
  const navigate = useNavigate();

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: { value: "", isValid: false },
      journalText: { value: "", isValid: false },
    },
    false
  );

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/api/journals/${entryId}`
        );

        setLoadedEntry(responseData.entry);

        setFormData(
          {
            title: { value: responseData.entry.title, isValid: true },
            journalText: {
              value: responseData.entry.journalText,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };

    fetchEntry();
  }, [sendRequest, entryId, setFormData]);

  const entryUpdateSubmitHandler = async (event) => {
    event.preventDefault();

    console.log("Submitting update…");
    console.log("Update request payload:", formState.inputs);

    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/api/journals/${entryId}`,
        "PATCH",
        JSON.stringify({
          title: formState.inputs.title.value,
          journalText: formState.inputs.journalText.value,
        }),
        {
          "Content-Type": "application/json",
        }
      );

      console.log("Response received:", responseData);
      console.log("setIsLoading should be triggered here");

      navigate("/"); 

    } catch (err) {
      console.log("Update failed with error:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedEntry && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find entry!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />

      {!isLoading && loadedEntry && (
        <form className="place-form" onSubmit={entryUpdateSubmitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
            initialValue={loadedEntry.title}
            initialValid={true}
          />

          <Input
            id="journalText"
            element="textarea"
            label="Journal Text"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter valid text (min. 5 characters)."
            onInput={inputHandler}
            initialValue={loadedEntry.journalText}
            initialValid={true}
          />

          <Button type="submit" disabled={!formState.isValid}>
            UPDATE ENTRY
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdateEntry;