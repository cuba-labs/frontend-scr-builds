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

import { AssociationO2OTestEntity } from "../../cuba/entities/scr_AssociationO2OTestEntity";
import { SerializedEntity, getStringId } from "@cuba-platform/rest";
import { AssociationO2OManagement } from "./AssociationO2OManagement";
import {
  FormattedMessage,
  injectIntl,
  WrappedComponentProps
} from "react-intl";

@injectMainStore
@observer
class AssociationO2OBrowseComponent extends React.Component<
  MainStoreInjected & WrappedComponentProps
> {
  dataCollection = collection<AssociationO2OTestEntity>(
    AssociationO2OTestEntity.NAME,
    {
      view: "associationO2OTestEntity-view",
      sort: "-updateTs"
    }
  );
  @observable selectedRowKey: string | undefined;

  fields = ["name", "datatypesTestEntity"];

  showDeletionDialog = (e: SerializedEntity<AssociationO2OTestEntity>) => {
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
        entityName={AssociationO2OTestEntity.NAME}
        operation="create"
        key="create"
      >
        <Link
          to={
            AssociationO2OManagement.PATH +
            "/" +
            AssociationO2OManagement.NEW_SUBPATH
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
        entityName={AssociationO2OTestEntity.NAME}
        operation="update"
        key="update"
      >
        <Link to={AssociationO2OManagement.PATH + "/" + this.selectedRowKey}>
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
        entityName={AssociationO2OTestEntity.NAME}
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

  getRecordById(id: string): SerializedEntity<AssociationO2OTestEntity> {
    const record:
      | SerializedEntity<AssociationO2OTestEntity>
      | undefined = this.dataCollection.items.find(
      record => getStringId(record.id!) === id
    );

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

const AssociationO2OBrowse = injectIntl(AssociationO2OBrowseComponent);

export default AssociationO2OBrowse;
