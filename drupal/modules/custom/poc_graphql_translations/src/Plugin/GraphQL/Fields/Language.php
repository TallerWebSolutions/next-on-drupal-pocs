<?php

namespace Drupal\poc_graphql_translations\Plugin\GraphQL\Fields;

use Drupal\graphql\Plugin\GraphQL\Fields\FieldPluginBase;
use Youshido\GraphQL\Execution\ResolveInfo;

/**
 *
 * @GraphQLField(
 *   id = "language",
 *   secure = true,
 *   name = "language",
 *   parents = {"Translation"},
 *   type = "String"
 * )
 */
class Language extends FieldPluginBase {

  /**
   * {@inheritdoc}
   */
  public function resolveValues($value, array $args, ResolveInfo $info) {
    yield $value['language'];
  }

}
