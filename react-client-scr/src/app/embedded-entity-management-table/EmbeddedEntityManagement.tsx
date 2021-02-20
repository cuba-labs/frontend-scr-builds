import * as React from "react";
import { RouteComponentProps } from "react-router";
import { observer } from "mobx-react";
import EmbeddedEntityEdit from "./EmbeddedEntityEdit";
import EmbeddedEntityTable from "./EmbeddedEntityTable";
import { PaginationConfig } from "antd/es/pagination";
import { action, observable } from "mobx";
import {
  addPagingParams,
  createPagingConfig,
  defaultPagingConfig
} from "@cuba-platform/react-ui";

type Props = RouteComponentProps<{ entityId?: string }>;

@observer
export class EmbeddedEntityManagement extends React.Component<Props> {
  static PATH = "/embeddedEntityManagement";
  static NEW_SUBPATH = "new";

  @observable paginationConfig: PaginationConfig = { ...defaultPagingConfig };

  componentDidMount(): void {
    // to disable paging config pass 'true' as disabled param in function below
    this.paginationConfig = createPagingConfig(this.props.location.search);
  }

  render() {
    const { entityId } = this.props.match.params;
    return entityId ? (
      <EmbeddedEntityEdit entityId={entityId} />
    ) : (
      <EmbeddedEntityTable />
    );
  }

  @action onPagingChange = (current: number, pageSize: number) => {
    this.props.history.push(
      addPagingParams("embeddedEntityManagement", current, pageSize)
    );
    this.paginationConfig = { ...this.paginationConfig, current, pageSize };
  };
}
