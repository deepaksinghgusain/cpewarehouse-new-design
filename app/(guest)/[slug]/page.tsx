import { imageUrl } from '@/lib/constants';
import { getPageContent } from '@/services/common';
import Image from 'next/image';
import React from 'react';

const Cmspage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const res = await getPageContent(slug.toLowerCase());

  const page = res?.data?.[0];
  const blocks = page?.attributes?.blocks ?? [];

  if (!page) {
    return (
      <section className="mx-auto w-[calc(100%-1rem)] py-16 text-center sm:w-[90%]">
        <h1 className="text-3xl font-semibold text-[#101828]">Page not found</h1>
      </section>
    );
  }

  return (
    <section className="mx-auto w-[calc(100%-1rem)] py-8 sm:w-[90%]">
      <div className="space-y-8">
        {blocks.map((block: any, index: number) => {
          const component = block?.__component;

          if (component === 'blocks.hero-simple-with-image') {
            return (
              <div
                key={`${component}-${index}`}
                className=""
              >
                <div className="flex items-center justify-start py-15">
                  <div>
                    <h1 className="text-3xl font-bold text-[#101828]">{block?.title}</h1>
                    {block?.subtitle && (
                      <p className="mt-3 text-lg">{block.subtitle}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          }

          if (component === 'blocks.static-section') {
            return (
              <div
                key={`${component}-${index}`}
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: block?.staticText ?? '' }}
              />
            );
          }

          if (component === 'blocks.page-highlight-with-image') {
            const image = block?.image?.data?.attributes?.url;

            return (
              <div
                key={`${component}-${index}`}
                className="flex flex-col items-center gap-6 rounded-2xl sm:flex-row"
              >
                <div className="flex-1">
                  <h2 className="">{block?.title}</h2>
                  {block?.description && (
                    <p className="mt-3">{block.description}</p>
                  )}
                  {block?.button?.href && block?.button?.label && (
                    <a
                      href={block.button.href}
                      className="mt-5 inline-block rounded-full bg-[#155dee] px-5 py-3 text-sm font-semibold text-white"
                    >
                      {block.button.label}
                    </a>
                  )}
                </div>

                {image && (
                  <div className="flex-shrink-0">
                    <Image
                      src={imageUrl + image}
                      alt={block?.title || 'Highlight'}
                      width={500}
                      height={500}
                      className=""
                    />
                  </div>
                )}
              </div>
            );
          }

          if (component === 'blocks.content-block') {
            return (
              <div
                key={`${component}-${index}`}
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: block?.content ?? '' }}
              />
            );
          }

          return (
            <div key={`${component}-${index}`}>

            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Cmspage