<?php

namespace Drupal\poc_graphql_translations\Plugin\GraphQL\Fields;

use Drupal\graphql\Plugin\GraphQL\Fields\FieldPluginBase;
use Youshido\GraphQL\Execution\ResolveInfo;

/**
 *
 * @GraphQLField(
 *   id = "translation.context",
 *   secure = true,
 *   name = "context",
 *   parents = {"Translation"},
 *   type = "String"
 * )
 */
class TranslationContext extends FieldPluginBase {

  /**
   * {@inheritdoc}
   */
  public function resolveValues($value, array $args, ResolveInfo $info) {
    yield $value['context'];
  }

}
