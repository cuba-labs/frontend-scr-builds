import * as React from "react";
import { Form, Alert, Button, Card, message } from "antd";
import { FormInstance } from "antd/es/form";
import { observer } from "mobx-react";
import { Datatypes2Management } from "./Datatypes2Management";
import { Link, Redirect } from "react-router-dom";
import { IReactionDisposer, observable, reaction, toJS } from "mobx";
import {
  FormattedMessage,
  injectIntl,
  WrappedComponentProps
} from "react-intl";
import {
  defaultHandleFinish,
  createAntdFormValidationMessages
} from "@cuba-platform/react-ui";

import {
  instance,
  MainStoreInjected,
  injectMainStore
} from "@cuba-platform/react-core";

import { Field, MultilineText, Spinner } from "@cuba-platform/react-ui";

import "../../app/App.css";

import { DatatypesTestEntity2 } from "../../cuba/entities/scr_DatatypesTestEntity2";

type Props = EditorProps & MainStoreInjected;

type EditorProps = {
  entityId: string;
};

@injectMainStore
@observer
class Datatypes2EditComponent extends React.Component<
  Props & WrappedComponentProps
> {
  dataInstance = instance<DatatypesTestEntity2>(DatatypesTestEntity2.NAME, {
    view: "datatypesTestEntity2-view",
    loadImmediately: false
  });

  @observable updated = false;
  @observable formRef: React.RefObject<FormInstance> = React.createRef();
  reactionDisposers: IReactionDisposer[] = [];

  fields = [
    "datatypesTestEntityAttr",
    "intIdentityIdTestEntityAttr",
    "integerIdTestEntityAttr",
    "stringIdTestEntityAttr",
    "weirdStringIdTestEntityAttr"
  ];

  @observable globalErrors: string[] = [];

  handleFinishFailed = () => {
    const { intl } = this.props;
    message.error(
      intl.formatMessage({ id: "management.editor.validationError" })
    );
  };

  handleFinish = (values: { [field: string]: any }) => {
    const { intl } = this.props;

    if (this.formRef.current != null) {
      defaultHandleFinish(
        values,
        this.dataInstance,
        intl,
        this.formRef.current,
        this.isNewEntity() ? "create" : "edit"
      ).then(({ success, globalErrors }) => {
        if (success) {
          this.updated = true;
        } else {
          this.globalErrors = globalErrors;
        }
      });
    }
  };

  isNewEntity = () => {
    return this.props.entityId === Datatypes2Management.NEW_SUBPATH;
  };

  render() {
    if (this.updated) {
      return <Redirect to={Datatypes2Management.PATH} />;
    }

    const { status, lastError, load } = this.dataInstance;
    const { mainStore, entityId, intl } = this.props;
    if (mainStore == null || !mainStore.isEntityDataLoaded()) {
      return <Spinner />;
    }

    // do not stop on "COMMIT_ERROR" - it could be bean validation, so we should show fields with errors
    if (status === "ERROR" && lastError === "LOAD_ERROR") {
      return (
        <>
          <FormattedMessage id="common.requestFailed" />.
          <br />
          <br />
          <Button htmlType="button" onClick={() => load(entityId)}>
            <FormattedMessage id="common.retry" />
          </Button>
        </>
      );
    }

    return (
      <Card className="narrow-layout">
        <Form
          onFinish={this.handleFinish}
          onFinishFailed={this.handleFinishFailed}
          layout="vertical"
          ref={this.formRef}
          validateMessages={createAntdFormValidationMessages(intl)}
        >
          <Field
            entityName={DatatypesTestEntity2.NAME}
            stringPath="datatypesTestEntityAttr"
            nestedEntityView="datatypesTestEntity-view"
            parentEntityInstanceId={
              this.props.entityId !== Datatypes2Management.NEW_SUBPATH
                ? this.props.entityId
                : undefined
            }
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={DatatypesTestEntity2.NAME}
            stringPath="intIdentityIdTestEntityAttr"
            nestedEntityView="_local"
            parentEntityInstanceId={
              this.props.entityId !== Datatypes2Management.NEW_SUBPATH
                ? this.props.entityId
                : undefined
            }
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={DatatypesTestEntity2.NAME}
            stringPath="integerIdTestEntityAttr"
            nestedEntityView="_local"
            parentEntityInstanceId={
              this.props.entityId !== Datatypes2Management.NEW_SUBPATH
                ? this.props.entityId
                : undefined
            }
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={DatatypesTestEntity2.NAME}
            stringPath="stringIdTestEntityAttr"
            nestedEntityView="_local"
            parentEntityInstanceId={
              this.props.entityId !== Datatypes2Management.NEW_SUBPATH
                ? this.props.entityId
                : undefined
            }
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={DatatypesTestEntity2.NAME}
            stringPath="weirdStringIdTestEntityAttr"
            nestedEntityView="_local"
            parentEntityInstanceId={
              this.props.entityId !== Datatypes2Management.NEW_SUBPATH
                ? this.props.entityId
                : undefined
            }
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          {this.globalErrors.length > 0 && (
            <Alert
              message={<MultilineText lines={toJS(this.globalErrors)} />}
              type="error"
              style={{ marginBottom: "24px" }}
            />
          )}

          <Form.Item style={{ textAlign: "center" }}>
            <Link to={Datatypes2Management.PATH}>
              <Button htmlType="button">
                <FormattedMessage id="common.cancel" />
              </Button>
            </Link>
            <Button
              type="primary"
              htmlType="submit"
              disabled={status !== "DONE" && status !== "ERROR"}
              loading={status === "LOADING"}
              style={{ marginLeft: "8px" }}
            >
              <FormattedMessage id="common.submit" />
            </Button>
          </Form.Item>
        </Form>
      </Card>
    );
  }

  componentDidMount() {
    if (this.isNewEntity()) {
      this.dataInstance.setItem(new DatatypesTestEntity2());
    } else {
      this.dataInstance.load(this.props.entityId);
    }

    this.reactionDisposers.push(
      reaction(
        () => this.dataInstance.status,
        () => {
          const { intl } = this.props;
          if (
            this.dataInstance.lastError != null &&
            this.dataInstance.lastError !== "COMMIT_ERROR"
          ) {
            message.error(intl.formatMessage({ id: "common.requestFailed" }));
          }
        }
      )
    );

    this.reactionDisposers.push(
      reaction(
        () => this.formRef.current,
        (formRefCurrent, formRefReaction) => {
          if (formRefCurrent != null) {
            // The Form has been successfully created.
            // It is now safe to set values on Form fields.
            this.reactionDisposers.push(
              reaction(
                () => this.dataInstance.item,
                () => {
                  formRefCurrent.setFieldsValue(
                    this.dataInstance.getFieldValues(this.fields)
                  );
                },
                { fireImmediately: true }
              )
            );
            formRefReaction.dispose();
          }
        },
        { fireImmediately: true }
      )
    );
  }

  componentWillUnmount() {
    this.reactionDisposers.forEach(dispose => dispose());
  }
}

export default injectIntl(Datatypes2EditComponent);
