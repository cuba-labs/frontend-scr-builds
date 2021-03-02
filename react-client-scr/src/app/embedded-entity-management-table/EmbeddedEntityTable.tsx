import * as React from "react";
import { observer } from "mobx-react";
import { Link } from "react-router-dom";
import { observable } from "mobx";
import { Modal, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import {
  collection,
  injectMainStore,
  MainStoreInjected,
  EntityPermAccessControl
} from "@cuba-platform/react-core";
import { DataTable, Spinner } from "@cuba-platform/react-ui";

import { EmbeddedTestEntity } from "../../cuba/entities/scr_EmbeddedTestEntity";
import { SerializedEntity } from "@cuba-platform/rest";
import { EmbeddedEntityManagement } from "./EmbeddedEntityManagement";
import {
  FormattedMessage,
  injectIntl,
  WrappedComponentProps
} from "react-intl";

@injectMainStore
@observer
class EmbeddedEntityTableComponent extends React.Component<
  MainStoreInjected & WrappedComponentProps
> {
  dataCollection = collection<EmbeddedTestEntity>(EmbeddedTestEntity.NAME, {
    view: "embeddedTestEntity-withEmbedded",
    sort: "-updateTs"
  });
  @observable selectedRowKey: string | undefined;

  fields = ["ownAttribute", "embedded"];

  showDeletionDialog = (e: SerializedEntity<EmbeddedTestEntity>) => {
    Modal.confirm({
      title: this.props.intl.formatMessage(
        { id: "management.browser.delete.areYouSure" },
        { instanceName: e._instanceName }
      ),
      okText: this.props.intl.formatMessage({
        id: "management.browser.delete.ok"
      }),
      cancelText: this.props.intl.formatMessage({ id: "common.cancel" }),
      onOk: () => {
        this.selectedRowKey = undefined;
        return this.dataCollection.delete(e);
      }
    });
  };

  render() {
    if (this.props.mainStore?.isEntityDataLoaded() !== true) return <Spinner />;

    const buttons = [
      <EntityPermAccessControl
        entityName={EmbeddedTestEntity.NAME}
        operation="create"
        key="create"
      >
        <Link
          to={
            EmbeddedEntityManagement.PATH +
            "/" +
            EmbeddedEntityManagement.NEW_SUBPATH
          }
        >
          <Button
            htmlType="button"
            style={{ margin: "0 12px 12px 0" }}
            type="primary"
            icon={<PlusOutlined />}
          >
            <span>
              <FormattedMessage id="common.create" />
            </span>
          </Button>
        </Link>
      </EntityPermAccessControl>,
      <EntityPermAccessControl
        entityName={EmbeddedTestEntity.NAME}
        operation="update"
        key="update"
      >
        <Link to={EmbeddedEntityManagement.PATH + "/" + this.selectedRowKey}>
          <Button
            htmlType="button"
            style={{ margin: "0 12px 12px 0" }}
            disabled={!this.selectedRowKey}
            type="default"
          >
            <FormattedMessage id="common.edit" />
          </Button>
        </Link>
      </EntityPermAccessControl>,
      <EntityPermAccessControl
        entityName={EmbeddedTestEntity.NAME}
        operation="delete"
        key="delete"
      >
        <Button
          htmlType="button"
          style={{ margin: "0 12px 12px 0" }}
          disabled={!this.selectedRowKey}
          onClick={this.deleteSelectedRow}
          type="default"
        >
          <FormattedMessage id="common.remove" />
        </Button>
      </EntityPermAccessControl>
    ];

    return (
      <DataTable
        dataCollection={this.dataCollection}
        fields={this.fields}
        onRowSelectionChange={this.handleRowSelectionChange}
        hideSelectionColumn={true}
        buttons={buttons}
      />
    );
  }

  getRecordById(id: string): SerializedEntity<EmbeddedTestEntity> {
    const record:
      | SerializedEntity<EmbeddedTestEntity>
      | undefined = this.dataCollection.items.find(record => record.id === id);

    if (!record) {
      throw new Error("Cannot find entity with id " + id);
    }

    return record;
  }

  handleRowSelectionChange = (selectedRowKeys: string[]) => {
    this.selectedRowKey = selectedRowKeys[0];
  };

  deleteSelectedRow = () => {
    this.showDeletionDialog(this.getRecordById(this.selectedRowKey!));
  };
}

const EmbeddedEntityTable = injectIntl(EmbeddedEntityTableComponent);

export default EmbeddedEntityTable;
