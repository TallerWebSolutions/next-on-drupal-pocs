<?php

namespace Drupal\poc_graphql_translations\Plugin\GraphQL\Fields;

use Drupal\graphql\Plugin\GraphQL\Fields\FieldPluginBase;
use Youshido\GraphQL\Execution\ResolveInfo;

/**
 *
 * @GraphQLField(
 *   id = "translation.source",
 *   secure = true,
 *   name = "source",
 *   parents = {"Translation"},
 *   type = "String"
 * )
 */
class Source extends FieldPluginBase {

  /**
   * {@inheritdoc}
   */
  public function resolveValues($value, array $args, ResolveInfo $info) {
    yield $value['source'];
  }

}
